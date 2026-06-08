import { Router } from 'express';
import { ArtistController } from '../controllers/artist.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const artistRoutes = Router();

artistRoutes.get('/me', authMiddleware, ArtistController.me);
artistRoutes.get('/me/stats', authMiddleware, ArtistController.stats);
artistRoutes.get('/', ArtistController.list);
artistRoutes.get('/:id', ArtistController.getById);
