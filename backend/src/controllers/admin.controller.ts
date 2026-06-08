import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../config/database';
import { ApiError } from '../utils/errors';

export const AdminController = {
  stats: asyncHandler(async (_req: Request, res: Response) => {
    const [users, songs, streams, distributions, payouts] = await Promise.all([
      prisma.user.count(),
      prisma.song.count(),
      prisma.stream.count(),
      prisma.royaltyDistribution.count(),
      prisma.mpesaPayout.count(),
    ]);
    res.json({
      success: true,
      data: { users, songs, streams, distributions, payouts },
    });
  }),

  listUsers: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 50);
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { artistProfile: true },
      }),
      prisma.user.count(),
    ]);
    res.json({ success: true, data: users, total, page, limit });
  }),

  deactivateUser: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw ApiError.badRequest('id required');
    await prisma.user.update({ where: { id }, data: { isActive: false } });
    res.json({ success: true });
  }),

  auditLogs: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 50);
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count(),
    ]);
    res.json({ success: true, data: logs, total, page, limit });
  }),
};
