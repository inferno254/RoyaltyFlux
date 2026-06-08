import cron from 'node-cron';
import { logger } from '../config/logger';
import { distributeRoyaltiesJob } from './distributeRoyalties.job';
import { syncStreamsJob } from './syncStreams.job';
import { syncMpesaPaymentsJob } from './syncMpesaPayments.job';
import { cleanupUploadsJob } from './cleanupUploads.job';

export function scheduleJobs() {
  // Royalty distribution every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Job: distributeRoyalties');
    try {
      await distributeRoyaltiesJob();
    } catch (err) {
      logger.error({ err }, 'distributeRoyalties failed');
    }
  });

  // Stream sync every 1 minute
  cron.schedule('* * * * *', async () => {
    try {
      await syncStreamsJob();
    } catch (err) {
      logger.error({ err }, 'syncStreams failed');
    }
  });

  // M-Pesa pending query every 30s
  cron.schedule('*/30 * * * * *', async () => {
    try {
      await syncMpesaPaymentsJob();
    } catch (err) {
      logger.error({ err }, 'syncMpesaPayments failed');
    }
  });

  // Daily cleanup of old uploads at 03:00
  cron.schedule('0 3 * * *', async () => {
    try {
      await cleanupUploadsJob();
    } catch (err) {
      logger.error({ err }, 'cleanupUploads failed');
    }
  });

  logger.info('Cron jobs scheduled');
}
