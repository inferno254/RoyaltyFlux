import { startBlockchainWorker, stopBlockchainWorker } from './blockchain.worker';
import { mpesaWorker } from './mpesa.worker';
import { logger } from '../config/logger';
import { closeRedis, getRedis } from '../config/redis';

export async function startWorkers() {
  await startBlockchainWorker();
  logger.info('All workers started');
}

export async function stopWorkers() {
  await stopBlockchainWorker();
  await mpesaWorker.close();
  await closeRedis();
}
