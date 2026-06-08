import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { streamService } from '../services/stream.service';

export const StreamController = {
  record: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub?: string } }).user?.sub;
    const ip = req.ip;
    const stream = await streamService.record(req.body.songId, userId, ip);
    res.status(201).json({ success: true, data: stream });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await streamService.list(req.query as never);
    res.json({ success: true, ...result, page: req.query.page, limit: req.query.limit });
  }),
};
