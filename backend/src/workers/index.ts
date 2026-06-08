import { mpesaQueue, royaltyQueue, streamQueue, makeWorker } from './mpesa.queue';
import { processMpesaCallbackJob } from '../jobs/processMpesaCallback.job';
import { distributeRoyaltiesJob } from '../jobs/distributeRoyalties.job';
import { syncStreamsJob } from '../jobs/syncStreams.job';
import { logger } from '../config/logger';
import { MpesaCallbackEnvelope } from '../types/mpesa.types';

export async function startWorkers() {
  const w1 = makeWorker<{ envelope: MpesaCallbackEnvelope }>('mpesa-callback', async ({ envelope }) => {
    await processMpesaCallbackJob(envelope);
  });
  const w2 = makeWorker('royalty-distribute', async () => {
    await distributeRoyaltiesJob();
  });
  const w3 = makeWorker('stream-sync', async () => {
    await syncStreamsJob();
  });

  for (const w of [w1, w2, w3]) {
    w.on('failed', (job, err) =>
      logger.error({ jobId: job?.id, name: w.name, err }, 'Worker job failed'),
    );
  }

  logger.info('Workers started: mpesa-callback, royalty-distribute, stream-sync');
  return [w1, w2, w3];
}

export { mpesaQueue, royaltyQueue, streamQueue };
