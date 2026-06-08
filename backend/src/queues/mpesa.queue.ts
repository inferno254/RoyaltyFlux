import { Queue, QueueEvents, Worker, JobsOptions } from 'bullmq';
import { getRedis } from '../config/redis';

export const mpesaQueue = new Queue('mpesa', { connection: getRedis() });
export const royaltyQueue = new Queue('royalty', { connection: getRedis() });
export const streamQueue = new Queue('stream', { connection: getRedis() });

export const mpesaEvents = new QueueEvents('mpesa', { connection: getRedis() });
export const royaltyEvents = new QueueEvents('royalty', { connection: getRedis() });
export const streamEvents = new QueueEvents('stream', { connection: getRedis() });

export const defaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5_000 },
  removeOnComplete: 1000,
  removeOnFail: 5000,
};

export type Processor<T> = (data: T) => Promise<void>;
export function makeWorker<T>(name: string, processor: Processor<T>) {
  return new Worker<T>(name, async (job) => processor(job.data), {
    connection: getRedis(),
    concurrency: 5,
  });
}
