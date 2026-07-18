import { Worker } from "bullmq";
import { redis } from "../lib/redis.js";
import { saveChunks } from "../services/repo.service.js";
import { saveEmbeddings } from "../services/embedding.service.js";
import prisma from "../lib/prisma.js";

// performs indexing in background
export const indexingWorker = new Worker(
  "indexing-queue",
  async (job) => {
    const id = job.data.repoId;

    await prisma.repository.update({
      where: { id: id },
      data: { status: "INDEXING" },
    });

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
