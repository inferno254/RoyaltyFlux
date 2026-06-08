import { prisma } from '../config/database';
import { mpesaService } from '../services/mpesa.service';
import { logger } from '../config/logger';
import { MpesaTxStatus } from '@prisma/client';

export async function syncMpesaPaymentsJob() {
  const pending = await prisma.mpesaPayout.findMany({
    where: { status: MpesaTxStatus.PENDING, createdAt: { lt: new Date(Date.now() - 30_000) } },
    take: 50,
  });
  for (const p of pending) {
    if (!p.checkoutRequestId) continue;
    try {
      await mpesaService.queryStatus(p.checkoutRequestId);
    } catch (err) {
      logger.warn({ err, payoutId: p.id }, 'STK query failed');
    }
  }
}
