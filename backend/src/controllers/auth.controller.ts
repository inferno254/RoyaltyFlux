import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authService } from '../services/auth.service';

export const AuthController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const tokens = await authService.register(req.body);
    res.status(201).json({ success: true, data: tokens });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const tokens = await authService.login(req.body);
    res.json({ success: true, data: tokens });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const tokens = await authService.refresh(req.body.refreshToken);
    res.json({ success: true, data: tokens });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    await authService.logout(userId, req.body?.refreshToken);
    res.json({ success: true });
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const token = await authService.requestPasswordReset(req.body.email);
    res.json({ success: true, message: 'If email exists, reset link sent', devToken: token });
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.token, req.body.password);
    res.json({ success: true, message: 'Password reset successful' });
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response) => {
    await authService.verifyEmail(req.body.token);
    res.json({ success: true });
  }),
};
