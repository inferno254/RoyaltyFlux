import { Router } from 'express';
import { MpesaController } from '../controllers/mpesa.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { stkPushSchema, mpesaCallbackSchema } from '../validators/mpesa.validator';
import { paymentLimiter } from '../middlewares/rateLimiter.middleware';

export const mpesaRoutes = Router();

mpesaRoutes.post(
  '/stkpush',
  authMiddleware,
  paymentLimiter,
  validate(stkPushSchema),
  MpesaController.stkPush,
);
mpesaRoutes.get('/status/:checkoutRequestId', authMiddleware, MpesaController.status);
mpesaRoutes.get('/list', authMiddleware, MpesaController.list);

// Callback (no auth — IP allowlist in production)
mpesaRoutes.post(
  '/callback',
  validate(mpesaCallbackSchema),
  MpesaController.callback,
);
