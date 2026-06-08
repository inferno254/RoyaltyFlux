import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ipfsService } from '../config/ipfs';
import { ApiError } from '../utils/errors';

export const UploadController = {
  uploadFile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('No file');
    const hash = await ipfsService.pinFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );
    res.json({ success: true, data: { hash, url: ipfsService.gatewayUrl(hash) } });
  }),

  uploadJSON: asyncHandler(async (req: Request, res: Response) => {
    if (!req.body || typeof req.body !== 'object') throw ApiError.badRequest('JSON body required');
    const name = (req.body.name as string) ?? `upload-${Date.now()}.json`;
    const hash = await ipfsService.pinJSON(req.body, name);
    res.json({ success: true, data: { hash, url: ipfsService.gatewayUrl(hash) } });
  }),
};
