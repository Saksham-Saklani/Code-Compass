import { Worker } from 'bullmq';
import { redis } from '../lib/redis.js';

export const indexingWorker = new Worker(
  'indexing-queue',
  async (job) => {
    console.log('Received job in indexing worker');
    console.log('Job data:', job.data);
    
    // Add any indexing logic here using job.data.repoId
  },
  {
    connection: redis as any,
  }
);

indexingWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

indexingWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);
});

console.log('Indexing worker started');
