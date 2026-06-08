import { prisma } from '../config/database';
import { mpesaClient } from '../config/mpesa';
import { ApiError } from '../utils/errors';
import { logger } from '../config/logger';
import { MpesaTxStatus, MpesaCallbackEnvelope } from '../types/mpesa.types';
import { normalizePhone } from '../utils/phone.util';

export class MpesaService {
  async stkPush(args: {
    userId: string;
    phone: string;
    amount: number;
    accountRef: string;
    transactionDesc: string;
    distributionId?: string;
  }) {
    const phone = normalizePhone(args.phone);
    if (args.amount < 1) throw ApiError.badRequest('Amount too small');

    const result = await mpesaClient.stkPush({
      phone,
      amount: args.amount,
      accountRef: args.accountRef,
      transactionDesc: args.transactionDesc,
    });

    if (result.ResponseCode !== '0') {
      logger.warn({ result }, 'M-Pesa STK push rejected');
      throw ApiError.badRequest(result.ResponseDescription);
    }

    const payout = await prisma.mpesaPayout.create({
      data: {
        userId: args.userId,
        distributionId: args.distributionId,
        phone,
        amountKes: args.amount,
        merchantRequestId: result.MerchantRequestID,
        checkoutRequestId: result.CheckoutRequestID,
        status: MpesaTxStatus.PENDING,
      },
    });

    return { payoutId: payout.id, checkoutRequestId: result.CheckoutRequestID, customerMessage: result.CustomerMessage };
  }

  async handleCallback(envelope: MpesaCallbackEnvelope) {
    const cb = envelope.Body.stkCallback;
    const payout = await prisma.mpesaPayout.findFirst({
      where: {
        OR: [
          { merchantRequestId: cb.MerchantRequestID },
          { checkoutRequestId: cb.CheckoutRequestID },
        ],
      },
    });
    if (!payout) {
      logger.warn({ cb }, 'M-Pesa callback for unknown payout');
      return;
    }

    const items = cb.CallbackMetadata?.Item ?? [];
    const getItem = (name: string) => items.find((i) => i.Name === name)?.Value;

    if (cb.ResultCode === 0) {
      await prisma.mpesaPayout.update({
        where: { id: payout.id },
        data: {
          status: MpesaTxStatus.SUCCESS,
          mpesaReceipt: getItem('MpesaReceiptNumber') as string | undefined,
          resultCode: cb.ResultCode,
          resultDesc: cb.ResultDesc,
          rawCallback: envelope as unknown as object,
        },
      });
    } else {
      await prisma.mpesaPayout.update({
        where: { id: payout.id },
        data: {
          status: MpesaTxStatus.FAILED,
          resultCode: cb.ResultCode,
          resultDesc: cb.ResultDesc,
          rawCallback: envelope as unknown as object,
        },
      });
    }
  }

  async queryStatus(checkoutRequestId: string) {
    const payout = await prisma.mpesaPayout.findUnique({ where: { checkoutRequestId } });
    if (!payout) throw ApiError.notFound('Payout not found');
    if (payout.status !== MpesaTxStatus.PENDING) {
      return payout;
    }
    const result = (await mpesaClient.stkQuery(checkoutRequestId)) as {
      ResultCode?: number;
      ResultDesc?: string;
    };
    if (result.ResultCode === 0) {
      return prisma.mpesaPayout.update({
        where: { id: payout.id },
        data: { status: MpesaTxStatus.SUCCESS, resultCode: 0, resultDesc: result.ResultDesc },
      });
    }
    return payout;
  }

  async list(limit = 50) {
    return prisma.mpesaPayout.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, email: true } } },
    });
  }
}

export const mpesaService = new MpesaService();
