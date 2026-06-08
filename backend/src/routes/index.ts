import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { artistRoutes } from './artist.routes';
import { songRoutes } from './song.routes';
import { nftRoutes } from './nft.routes';
import { royaltyRoutes } from './royalty.routes';
import { streamRoutes } from './stream.routes';
import { mpesaRoutes } from './mpesa.routes';
import { uploadRoutes } from './upload.routes';
import { webhookRoutes } from './webhook.routes';
import { adminRoutes } from './admin.routes';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/artists', artistRoutes);
routes.use('/songs', songRoutes);
routes.use('/nfts', nftRoutes);
routes.use('/royalties', royaltyRoutes);
routes.use('/streams', streamRoutes);
routes.use('/mpesa', mpesaRoutes);
routes.use('/upload', uploadRoutes);
routes.use('/webhooks', webhookRoutes);
routes.use('/admin', adminRoutes);
