import { embedText } from "../lib/embedding.js";
import prisma from "../lib/prisma.js";
import { qdrant, COLLECTION_NAME } from "../lib/qdrant.js";

// create embeddings of chunks content and save into qdrant collection

const BATCH_SIZE = 5;

export async function saveEmbeddings(repoId: string) {
  const chunks = await prisma.chunk.findMany({
    where: {
      repoId,
    },
  });

  if (chunks.length === 0) return;

  const points = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const contents = batch.map((c) => c.content);

    console.log(`Sending batch of ${contents.length} texts in ONE call`);
    const embeddings = (await embedText(contents)) as number[][];
    console.log(`Received ${embeddings.length} embeddings back`);

    // Get embeddings for the entire batch in a single API call
    // const embeddings = (await embedText(contents)) as number[][];

    for (let j = 0; j < batch.length; j++) {
      const item = batch[j];
      const vector = embeddings[j];
      if (item && vector) {
        points.push({
          id: item.id,
          vector,
          payload: {
            repoId: item.repoId,
            filePath: item.filePath,
            chunkIndex: item.chunkIndex,
            tokenCount: item.tokenCount,
          },
        });
      }
    }

    // Brief delay between batches to respect Gemini rate limits
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  if (points.length > 0) {
    await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      points,
    });
  }
}
