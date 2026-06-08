import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { artistService } from '../services/artist.service';

export const ArtistController = {
  getById: asyncHandler(async (req: Request, res: Response) => {
    const artist = await artistService.getById(req.params.id);
    res.json({ success: true, data: artist });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub!;
    const artist = await artistService.getByUserId(userId);
    res.json({ success: true, data: artist });
  }),

  stats: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub!;
    const stats = await artistService.getStats(userId);
    res.json({ success: true, data: stats });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const result = await artistService.list(page, limit);
    res.json({ success: true, ...result, page, limit });
  }),
};
