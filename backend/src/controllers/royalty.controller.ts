import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { royaltyService } from '../services/royalty.service';
import { ApiError } from '../utils/errors';

export const RoyaltyController = {
  calculate: asyncHandler(async (req: Request, res: Response) => {
    const result = await royaltyService.calculateDistribution(req.params.songId);
    res.json({ success: true, data: result });
  }),

  myEarnings: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub;
    if (!userId) throw ApiError.unauthorized();
    const result = await royaltyService.getUserEarnings(userId);
    res.json({ success: true, data: result });
  }),

  onChainPending: asyncHandler(async (req: Request, res: Response) => {
    const { splitter, account } = req.query;
    const pending = await royaltyService.getOnChainPending(String(splitter), String(account));
    res.json({ success: true, data: { pending } });
  }),

  distributions: asyncHandler(async (req: Request, res: Response) => {
    const list = await royaltyService.listDistributions(req.params.songId);
    res.json({ success: true, data: list });
  }),
};
