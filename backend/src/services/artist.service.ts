import { prisma } from '../config/database';
import { ApiError } from '../utils/errors';

export class ArtistService {
  async getById(id: string) {
    const profile = await prisma.artistProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, walletAddress: true } } },
    });
    if (!profile) throw ApiError.notFound('Artist not found');
    return profile;
  }

  async getByUserId(userId: string) {
    const profile = await prisma.artistProfile.findUnique({
      where: { userId },
      include: { user: { select: { id: true, email: true, walletAddress: true } } },
    });
    if (!profile) throw ApiError.notFound('Artist profile not found');
    return profile;
  }

  async getStats(userId: string) {
    const profile = await prisma.artistProfile.findUnique({ where: { userId } });
    if (!profile) throw ApiError.notFound('Artist profile not found');

    const [songCount, totalStreams, recentStreams] = await Promise.all([
      prisma.song.count({ where: { artistId: userId, status: 'MINTED' } }),
      prisma.stream.count({ where: { song: { artistId: userId } } }),
      prisma.stream.findMany({
        where: { song: { artistId: userId } },
        orderBy: { streamAt: 'desc' },
        take: 100,
      }),
    ]);

    return { profile, songCount, totalStreams, recentStreams };
  }

  async list(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [artists, total] = await Promise.all([
      prisma.artistProfile.findMany({
        skip,
        take: limit,
        orderBy: { totalStreams: 'desc' },
        include: { user: { select: { id: true, walletAddress: true } } },
      }),
      prisma.artistProfile.count(),
    ]);
    return { artists, total };
  }
}

export const artistService = new ArtistService();
