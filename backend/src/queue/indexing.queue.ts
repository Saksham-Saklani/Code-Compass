import { Queue } from 'bullmq';
import { redis } from '../lib/redis.js';

export const indexingQueue = new Queue('indexing-queue', {
  connection: redis as any,
});

export const addDummyJob = async () => {
  const result = await indexingQueue.add('dummy-job', {
   repoId: '5a8479ff-9699-4c09-80ac-0cf7cea7c586'
  });
  console.log('Added  repo job to indexing-queue');
  console.log(result.data)

};

