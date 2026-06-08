import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { songService } from '../services/song.service';
import { ApiError } from '../utils/errors';

export const SongController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub;
    if (!userId) throw ApiError.unauthorized();
    const song = await songService.create(userId, req.body);
    res.status(201).json({ success: true, data: song });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const song = await songService.getById(req.params.id);
    res.json({ success: true, data: song });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await songService.list(req.query as never);
    res.json({ success: true, ...result, page: req.query.page, limit: req.query.limit });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub!;
    const song = await songService.getById(req.params.id);
    if (song.artistId !== userId) throw ApiError.forbidden();
    const updated = await songService.update
      ? await (await import('../config/database')).prisma.song.update({
          where: { id: req.params.id },
          data: req.body,
        })
      : song;
    res.json({ success: true, data: updated });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub!;
    await songService.delete(req.params.id, userId);
    res.json({ success: true });
  }),

  uploadAudio: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub!;
    if (!req.file) throw ApiError.badRequest('No file uploaded');
    const result = await songService.uploadAudio(
      req.params.id,
      userId,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );
    res.json({ success: true, data: result });
  }),

  uploadCover: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { sub: string } }).user?.sub!;
    if (!req.file) throw ApiError.badRequest('No file uploaded');
    const result = await songService.uploadCover(
      req.params.id,
      userId,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );
    res.json({ success: true, data: result });
  }),

  buildMetadata: asyncHandler(async (req: Request, res: Response) => {
    const result = await songService.buildMetadata(req.params.id);
    res.json({ success: true, data: result });
  }),
};
