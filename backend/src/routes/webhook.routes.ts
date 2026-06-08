import { Router } from 'express';
import { MpesaController } from '../controllers/mpesa.controller';
import { validate } from '../middlewares/validate.middleware';
import { mpesaCallbackSchema } from '../validators/mpesa.validator';

// Alias for /mpesa/callback (some Daraja configs expect this path)
export const webhookRoutes = Router();
webhookRoutes.post('/mpesa/callback', validate(mpesaCallbackSchema), MpesaController.callback);
