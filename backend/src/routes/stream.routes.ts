import { Router } from 'express';
import { StreamController } from '../controllers/stream.controller';
import { authMiddleware, optionalAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { streamCreateSchema, streamQuerySchema } from '../validators/royalty.validator';

export const streamRoutes = Router();

streamRoutes.post('/', optionalAuth, validate(streamCreateSchema), StreamController.record);
streamRoutes.get('/', authMiddleware, validate(streamQuerySchema, 'query'), StreamController.list);
