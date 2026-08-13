import { Worker } from "bullmq";
import { redis } from "../lib/redis.js";
import { saveChunks } from "../services/repo.service.js";
import { saveEmbeddings } from "../services/embedding.service.js";
import prisma from "../lib/prisma.js";
import { qdrant, COLLECTION_NAME } from "../lib/qdrant.js";

// performs indexing in background
export const indexingWorker = new Worker(
  "indexing-queue",
  async (job) => {
    const id = job.data.repoId;

    await prisma.repository.update({
      where: { id: id },
      data: { status: "INDEXING" },
    });

    // Cleanup existing chunks and embeddings for retries
    await prisma.chunk.deleteMany({
      where: { repoId: id },
    });
    
    try {
      await qdrant.delete(COLLECTION_NAME, {
        filter: { must: [{ key: "repoId", match: { value: id } }] },
      });
    } catch (e) {
      console.warn("Failed to delete existing vectors in Qdrant:", e);
    }


    const chunks = await saveChunks(id);
    const embeddings = await saveEmbeddings(id);
  },
  {
    connection: redis as any,
  },
);

indexingWorker.on("completed", async (job) => {
  await prisma.repository.update({
    where: {
      id: job.data.repoId,
    },
    data: {
      status: "COMPLETED",
    },
  });
});

indexingWorker.on("failed", async (job, err) => {
  await prisma.repository.update({
    where: {
      id: job?.data.repoId,
    },
    data: {
      status: "FAILED",
    },
  });
  console.error(`Job ${job?.id} failed with error:`, err);
});

console.log("Indexing worker started");
