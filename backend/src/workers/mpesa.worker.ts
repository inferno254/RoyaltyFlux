import { makeWorker } from './index';
import { processMpesaCallbackJob } from '../jobs/processMpesaCallback.job';
import { MpesaCallbackEnvelope } from '../types/mpesa.types';

export const mpesaWorker = makeWorker<{ envelope: MpesaCallbackEnvelope }>(
  'mpesa-callback',
  async ({ envelope }) => processMpesaCallbackJob(envelope),
);
