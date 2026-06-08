import { Queue, Worker, QueueEvents } from 'bullmq';
import { getRedis } from '../config/redis';
import { logger } from '../config/logger';

const connection = { connection: getRedis() };

export const mpesaQueue = new Queue('mpesa', connection);
export const royaltyQueue = new Queue('royalty', connection);
export const streamQueue = new Queue('stream', connection);

export const queueEvents = {
  mpesa: new QueueEvents('mpesa', connection),
  royalty: new QueueEvents('royalty', connection),
  stream: new QueueEvents('stream', connection),
};

export function makeWorker<T>(name: string, processor: (data: T) => Promise<void>) {
  const worker = new Worker<T>(name, async (job) => processor(job.data), connection);
  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, name, err }, 'Job failed');
  });
  worker.on('completed', (job) => {
    logger.info({ jobId: job.id, name }, 'Job completed');
  });
  return worker;
}
