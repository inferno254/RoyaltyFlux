import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { mpesaService } from '../services/mpesa.service';
import { ApiError } from '../utils/errors';

export const MpesaController = {
  stkPush: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub;
    if (!userId) throw ApiError.unauthorized();
    const result = await mpesaService.stkPush({ userId, ...req.body });
    res.json({ success: true, data: result });
  }),

  callback: asyncHandler(async (req: Request, res: Response) => {
    await mpesaService.handleCallback(req.body);
    res.json({ success: true });
  }),

  status: asyncHandler(async (req: Request, res: Response) => {
    const payout = await mpesaService.queryStatus(req.params.checkoutRequestId);
    res.json({ success: true, data: payout });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const list = await mpesaService.list(Number(req.query.limit ?? 50));
    res.json({ success: true, data: list });
  }),
};
