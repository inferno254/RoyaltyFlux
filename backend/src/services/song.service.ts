import { prisma } from '../config/database';
import { ipfsService } from '../config/ipfs';
import { ApiError } from '../utils/errors';
import { SongStatus } from '@prisma/client';
import { sha256 } from '../utils/crypto.util';
import { logger } from '../config/logger';

export class SongService {
  async create(
    artistId: string,
    data: {
      title: string;
      description?: string;
      genre?: string;
      releaseDate?: string;
      collaborators: { userId: string; shareBps: number }[];
    },
  ) {
    // Verify all collaborators exist
    const collaboratorIds = data.collaborators.map((c) => c.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: collaboratorIds } },
      select: { id: true },
    });
    if (users.length !== collaboratorIds.length) {
      throw ApiError.badRequest('One or more collaborators not found');
    }

    const song = await prisma.song.create({
      data: {
        title: data.title,
        description: data.description,
        genre: data.genre,
        releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
        artistId,
        status: SongStatus.DRAFT,
        collaborators: {
          create: data.collaborators.map((c) => ({
            userId: c.userId,
            shareBps: c.shareBps,
          })),
        },
      },
      include: { collaborators: { include: { user: true } } },
    });

    return song;
  }

  async getById(id: string) {
    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        artist: { select: { id: true, email: true, walletAddress: true, artistProfile: true } },
        collaborators: { include: { user: { select: { id: true, walletAddress: true, email: true } } } },
        streams: { take: 5, orderBy: { streamAt: 'desc' } },
      },
    });
    if (!song) throw ApiError.notFound('Song not found');
    return song;
  }

  async list(opts: {
    page?: number;
    limit?: number;
    status?: SongStatus;
    genre?: string;
    artistId?: string;
    q?: string;
  }) {
    const { page = 1, limit = 20, status, genre, artistId, q } = opts;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (genre) where.genre = genre;
    if (artistId) where.artistId = artistId;
    if (q) where.title = { contains: q, mode: 'insensitive' };

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          artist: { select: { id: true, artistProfile: true } },
        },
      }),
      prisma.song.count({ where }),
    ]);

    return { songs, total };
  }

  async uploadAudio(songId: string, artistId: string, buffer: Buffer, fileName: string, mimeType: string) {
    const song = await this.getById(songId);
    if (song.artistId !== artistId) throw ApiError.forbidden('Not the song owner');
    if (song.status !== SongStatus.DRAFT) {
      throw ApiError.badRequest('Song already processed');
    }
    const hash = await ipfsService.pinFile(buffer, fileName, mimeType);
    await prisma.song.update({
      where: { id: songId },
      data: { ipfsAudioHash: hash, status: SongStatus.PROCESSING },
    });
    logger.info({ songId, hash }, 'Audio uploaded to IPFS');
    return { ipfsHash: hash, gatewayUrl: ipfsService.gatewayUrl(hash) };
  }

  async uploadCover(songId: string, artistId: string, buffer: Buffer, fileName: string, mimeType: string) {
    const song = await this.getById(songId);
    if (song.artistId !== artistId) throw ApiError.forbidden('Not the song owner');
    const hash = await ipfsService.pinFile(buffer, fileName, mimeType);
    await prisma.song.update({ where: { id: songId }, data: { ipfsCoverHash: hash } });
    return { ipfsHash: hash, gatewayUrl: ipfsService.gatewayUrl(hash) };
  }

  async buildMetadata(songId: string) {
    const song = await this.getById(songId);
    if (!song.ipfsAudioHash || !song.ipfsCoverHash) {
      throw ApiError.badRequest('Audio and cover must be uploaded first');
    }
    const metadata = {
      name: song.title,
      description: song.description ?? '',
      image: ipfsService.gatewayUrl(song.ipfsCoverHash),
      animation_url: ipfsService.gatewayUrl(song.ipfsAudioHash),
      external_url: `https://royaltyflux.io/song/${song.id}`,
      attributes: [
        { trait_type: 'Genre', value: song.genre ?? 'Unknown' },
        { trait_type: 'Duration', value: song.durationSec ?? 0 },
        { trait_type: 'Release Date', value: song.releaseDate?.toISOString() ?? '' },
      ],
    };
    const hash = await ipfsService.pinJSON(metadata, `${song.title}-metadata.json`);
    await prisma.song.update({ where: { id: songId }, data: { ipfsMetadataUri: hash } });
    return { ipfsHash: hash, gatewayUrl: ipfsService.gatewayUrl(hash), songHash: sha256(hash) };
  }

  async updateStatus(songId: string, status: SongStatus, extra: Partial<{ tokenId: bigint; contractAddress: string; splitterAddress: string }> = {}) {
    return prisma.song.update({ where: { id: songId }, data: { status, ...extra } });
  }

  async delete(id: string, userId: string) {
    const song = await this.getById(id);
    if (song.artistId !== userId) throw ApiError.forbidden('Not the song owner');
    if (song.status === SongStatus.MINTED) throw ApiError.badRequest('Cannot delete minted song');
    await prisma.song.delete({ where: { id } });
  }
}

export const songService = new SongService();
