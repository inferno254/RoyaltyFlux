import { prisma } from '../config/database';

export class StreamService {
  async record(songId: string, userId?: string, ip?: string) {
    return prisma.stream.create({ data: { songId, userId, listenerIp: ip } });
  }

  async list(opts: {
    page?: number;
    limit?: number;
    songId?: string;
    userId?: string;
    from?: string;
    to?: string;
  }) {
    const { page = 1, limit = 50, songId, userId, from, to } = opts;
    const where: Record<string, unknown> = {};
    if (songId) where.songId = songId;
    if (userId) where.userId = userId;
    if (from || to) {
      where.streamAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }
    const [streams, total] = await Promise.all([
      prisma.stream.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { streamAt: 'desc' },
        include: { song: { select: { id: true, title: true } } },
      }),
      prisma.stream.count({ where }),
    ]);
    return { streams, total };
  }

  async getUnreportedStreams(songId: string) {
    return prisma.stream.count({ where: { songId, reportedOnChain: false } });
  }
}

export const streamService = new StreamService();
