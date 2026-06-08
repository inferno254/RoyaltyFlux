import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { mpesaService } from '../services/mpesa.service';
import { MpesaCallbackEnvelope } from '../types/mpesa.types';

export async function processMpesaCallbackJob(envelope: MpesaCallbackEnvelope) {
  try {
    await mpesaService.handleCallback(envelope);
  } catch (err) {
    logger.error({ err }, 'M-Pesa callback processing failed');
  }
}
