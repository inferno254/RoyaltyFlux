import { Router } from 'express';
import { NftController } from '../controllers/nft.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { mintSongSchema, recordStreamsSchema } from '../validators/nft.validator';

export const nftRoutes = Router();

nftRoutes.post(
  '/mint',
  authMiddleware,
  requireRole('ARTIST', 'ADMIN'),
  validate(mintSongSchema),
  NftController.mint,
);

nftRoutes.post(
  '/record-streams',
  authMiddleware,
  requireRole('ADMIN'),
  validate(recordStreamsSchema),
  NftController.recordStreams,
);

nftRoutes.get('/:tokenId', NftController.info);
