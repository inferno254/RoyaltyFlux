import { Router } from 'express';
import { SongController } from '../controllers/song.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';
import { audioUpload, imageUpload } from '../middlewares/upload.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  songUploadSchema,
  songUpdateSchema,
  songIdParamSchema,
  songQuerySchema,
} from '../validators/song.validator';

export const songRoutes = Router();

songRoutes.get('/', validate(songQuerySchema, 'query'), SongController.list);
songRoutes.get('/:id', SongController.getById);

songRoutes.post(
  '/',
  authMiddleware,
  requireRole('ARTIST', 'ADMIN'),
  validate(songUploadSchema),
  SongController.create,
);

songRoutes.patch(
  '/:id',
  authMiddleware,
  validate(songIdParamSchema, 'params'),
  validate(songUpdateSchema),
  SongController.update,
);

songRoutes.delete('/:id', authMiddleware, SongController.delete);

songRoutes.post(
  '/:id/audio',
  authMiddleware,
  audioUpload.single('file'),
  SongController.uploadAudio,
);

songRoutes.post(
  '/:id/cover',
  authMiddleware,
  imageUpload.single('file'),
  SongController.uploadCover,
);

songRoutes.post('/:id/build-metadata', authMiddleware, SongController.buildMetadata);
