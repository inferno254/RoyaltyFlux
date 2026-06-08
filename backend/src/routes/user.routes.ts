import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

export const userRoutes = Router();

userRoutes.get('/me', authMiddleware, UserController.me);
userRoutes.patch('/me', authMiddleware, UserController.updateMe);
userRoutes.get('/', authMiddleware, requireRole('ADMIN'), UserController.list);
userRoutes.get('/:id', authMiddleware, UserController.getById);
