import { Queue, Worker } from 'bullmq';
import { redis } from '../config/redis';

export const emailQueue = new Queue('emailQueue', {
  connection: redis,
});

// Example Worker
const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    console.log('Processing email job:', job.id, job.data);
    // Add email sending logic here
  },
  { connection: redis }
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
