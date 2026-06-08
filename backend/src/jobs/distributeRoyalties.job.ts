import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { mpesaService } from '../services/mpesa.service';
import { RoyaltyStatus } from '@prisma/client';
import { NotificationSocket } from '../sockets/notification.socket';

export async function distributeRoyaltiesJob() {
  const songs = await prisma.song.findMany({
    where: { status: 'MINTED', tokenId: { not: null } },
    include: { collaborators: { include: { user: true } } },
  });

  for (const song of songs) {
    const lastDist = await prisma.royaltyDistribution.findFirst({
      where: { songId: song.id },
      orderBy: { createdAt: 'desc' },
    });
    const fromDate = lastDist?.createdAt ?? song.createdAt;
    const streamCount = await prisma.stream.count({
      where: { songId: song.id, streamAt: { gt: fromDate } },
    });
    if (streamCount === 0) continue;

    const totalKes = streamCount * 0.1; // tier 1
    const dist = await prisma.royaltyDistribution.create({
      data: { songId: song.id, totalKes, totalStreams: streamCount, status: RoyaltyStatus.PENDING },
    });

    for (const collab of song.collaborators) {
      if (!collab.user.phone) continue;
      const amount = Number(((totalKes * collab.shareBps) / 10_000).toFixed(2));
      if (amount < 1) continue;
      try {
        const result = await mpesaService.stkPush({
          userId: collab.userId,
          phone: collab.user.phone,
          amount,
          accountRef: `RFX-${song.id.slice(0, 8)}`,
          transactionDesc: `Royalty: ${song.title}`,
          distributionId: dist.id,
        });
        NotificationSocket.push(collab.userId, {
          type: 'PAYOUT_INITIATED',
          title: 'Payout initiated',
          body: `KES ${amount} from ${song.title}`,
          data: { payoutId: result.payoutId },
        });
      } catch (err) {
        logger.error({ err, songId: song.id, userId: collab.userId }, 'Payout failed');
      }
    }
    await prisma.royaltyDistribution.update({
      where: { id: dist.id },
      data: { status: RoyaltyStatus.DISTRIBUTED, distributedAt: new Date() },
    });
  }
}
