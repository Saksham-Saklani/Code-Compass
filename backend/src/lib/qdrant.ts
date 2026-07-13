import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";
dotenv.config();

export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
});

 const COLLECTION_NAME = "code_compass";

// Setup logic running directly
const collections = await qdrant.getCollections();
const exists = collections.collections.some((c) => c.name === COLLECTION_NAME);

if (!exists) {
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: {
      size: 1024,
      distance: "Cosine",
    },
  });
  console.log(`[Qdrant] Created collection: ${COLLECTION_NAME}`);
} else {
  console.log(`[Qdrant] Collection '${COLLECTION_NAME}' already exists.`);
}
