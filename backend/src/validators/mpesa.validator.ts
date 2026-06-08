import { z } from 'zod';
import { PHONE_REGEX, MPESA_MIN_AMOUNT_KES, MPESA_MAX_AMOUNT_KES } from '../utils/constants';

export const stkPushSchema = z.object({
  body: z.object({
    phone: z.string().regex(PHONE_REGEX, 'Invalid Kenyan phone'),
    amount: z.number().min(MPESA_MIN_AMOUNT_KES).max(MPESA_MAX_AMOUNT_KES),
    accountRef: z.string().min(1).max(50),
    transactionDesc: z.string().min(1).max(100),
  }),
});

export const royaltyWithdrawSchema = z.object({
  body: z.object({
    amount: z.number().positive().max(MPESA_MAX_AMOUNT_KES),
    phone: z.string().regex(PHONE_REGEX),
  }),
});

export const mpesaCallbackSchema = z.object({
  body: z.object({
    Body: z.object({
      stkCallback: z.object({
        MerchantRequestID: z.string(),
        CheckoutRequestID: z.string(),
        ResultCode: z.number(),
        ResultDesc: z.string(),
        CallbackMetadata: z
          .object({
            Item: z.array(
              z.union([
                z.object({ Name: z.string(), Value: z.union([z.string(), z.number()]) }),
                z.object({ Name: z.string(), Value: z.null() }),
              ]),
            ),
          })
          .optional(),
      }),
    }),
  }),
});
