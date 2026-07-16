import { embedText } from "../lib/embedding.js";
import prisma from "../lib/prisma.js";
import { qdrant } from "../lib/qdrant.js";



// create embeddings of chunks content and save into qdrant collection

export async function saveEmbeddings(repoId: string) {
  const chunks = await prisma.chunk.findMany({
    where: {
      repoId,
    },
  });

  const points = [];

  for (const chunk of chunks) {
    const embedding = await embedText(chunk.content);
    points.push({
      id: chunk.id,
      vector: embedding,
      payload: {
        repoId: chunk.repoId,
        filePath: chunk.filePath,
        chunkIndex: chunk.chunkIndex,
        tokenCount: chunk.tokenCount,
      },
    });
  }

  if (points.length > 0) {
    await qdrant.upsert("code_compass", {
      wait: true,
      points,
    });
  }
  
}
