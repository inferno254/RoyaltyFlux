import { prisma } from '../config/database';
import { logger } from '../config/logger';

export async function syncStreamsJob() {
  const songs = await prisma.song.findMany({
    where: { status: 'MINTED', tokenId: { not: null } },
    select: { id: true, tokenId: true },
  });

  for (const song of songs) {
    const unreported = await prisma.stream.count({
      where: { songId: song.id, reportedOnChain: false },
    });
    if (unreported > 0) {
      logger.info({ songId: song.id, count: unreported }, 'Streams ready to report on-chain');
    }
  }
}
