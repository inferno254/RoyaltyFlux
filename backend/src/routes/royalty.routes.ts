import { Router } from 'express';
import { RoyaltyController } from '../controllers/royalty.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const royaltyRoutes = Router();

royaltyRoutes.get('/me/earnings', authMiddleware, RoyaltyController.myEarnings);
royaltyRoutes.get('/onchain-pending', RoyaltyController.onChainPending);
royaltyRoutes.get('/songs/:songId/calculate', RoyaltyController.calculate);
royaltyRoutes.get('/songs/:songId/distributions', RoyaltyController.distributions);
