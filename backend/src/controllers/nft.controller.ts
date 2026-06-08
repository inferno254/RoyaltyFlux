import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { nftService } from '../services/nft.service';
import { ApiError } from '../utils/errors';

export const NftController = {
  mint: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub;
    if (!userId) throw ApiError.unauthorized();
    const { songId, artistAddress } = req.body;
    const result = await nftService.mintSong(songId, artistAddress);
    res.json({ success: true, data: result });
  }),

  recordStreams: asyncHandler(async (req: Request, res: Response) => {
    const { songId, streamCount } = req.body;
    const result = await nftService.recordStreams(songId, streamCount);
    res.json({ success: true, data: result });
  }),

  info: asyncHandler(async (req: Request, res: Response) => {
    const info = await nftService.getOnChainInfo(req.params.tokenId);
    res.json({ success: true, data: info });
  }),
};
