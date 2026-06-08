import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { anyUpload } from '../middlewares/upload.middleware';

export const uploadRoutes = Router();

uploadRoutes.post('/file', authMiddleware, anyUpload.single('file'), UploadController.uploadFile);
uploadRoutes.post('/json', authMiddleware, UploadController.uploadJSON);
