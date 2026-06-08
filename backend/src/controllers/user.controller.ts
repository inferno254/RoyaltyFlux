import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { userService } from '../services/user.service';
import { ApiError } from '../utils/errors';

export const UserController = {
  me: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub;
    if (!userId) throw ApiError.unauthorized();
    const user = await userService.getById(userId);
    res.json({ success: true, data: user });
  }),

  updateMe: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub;
    if (!userId) throw ApiError.unauthorized();
    const user = await userService.update(userId, req.body);
    res.json({ success: true, data: user });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const result = await userService.list(page, limit);
    res.json({ success: true, ...result, page, limit });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getById(req.params.id);
    res.json({ success: true, data: user });
  }),
};
