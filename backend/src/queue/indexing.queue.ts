import { Queue } from "bullmq";
import { redis } from "../lib/redis.js";

export const indexingQueue = new Queue("indexing-queue", {
  connection: redis as any,
});
