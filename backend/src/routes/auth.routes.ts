import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../validators/auth.validator';
import { authMiddleware } from '../middlewares/auth.middleware';

export const authRoutes = Router();

authRoutes.post('/register', authLimiter, validate(registerSchema), AuthController.register);
authRoutes.post('/login', authLimiter, validate(loginSchema), AuthController.login);
authRoutes.post('/refresh', validate(refreshSchema), AuthController.refresh);
authRoutes.post('/logout', authMiddleware, AuthController.logout);
authRoutes.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
authRoutes.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);
authRoutes.post('/verify-email', validate(verifyEmailSchema), AuthController.verifyEmail);
