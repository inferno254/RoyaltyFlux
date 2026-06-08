import { prisma } from '../config/database';
import { ApiError } from '../utils/errors';
import { ethers } from 'ethers';
import { provider, ROYALTY_SPLITTER_ABI } from '../config/blockchain';
import { logger } from '../config/logger';

export class RoyaltyService {
  /**
   * Calculate pending payout per collaborator for a song.
   * Stream count * tier rate (KES) * shareBps / 10000
   */
  async calculateDistribution(songId: string) {
    const song = await prisma.song.findUnique({
      where: { id: songId },
      include: { collaborators: { include: { user: true } } },
    });
    if (!song) throw ApiError.notFound('Song not found');

    // Tier 1 (standard) default; can be overridden
    const tierRateKes = 0.10;
    const lastDistribution = await prisma.royaltyDistribution.findFirst({
      where: { songId },
      orderBy: { createdAt: 'desc' },
    });
    const fromDate = lastDistribution?.createdAt ?? song.createdAt;
    const totalStreams = await prisma.stream.count({
      where: { songId, streamAt: { gt: fromDate } },
    });

    const totalKes = totalStreams * tierRateKes;
    const payouts = song.collaborators.map((c) => ({
      userId: c.userId,
      phone: c.user.phone,
      shareBps: c.shareBps,
      amountKes: Number(((totalKes * c.shareBps) / 10_000).toFixed(2)),
    }));
    return { totalStreams, totalKes, payouts };
  }

  /**
   * Get on-chain pending release for a given splitter & user
   */
  async getOnChainPending(splitterAddress: string, account: string) {
    if (!ethers.isAddress(splitterAddress) || !ethers.isAddress(account)) return '0';
    const splitter = new ethers.Contract(splitterAddress, ROYALTY_SPLITTER_ABI, provider);
    try {
      const pending = await splitter.pendingRelease(account);
      return ethers.formatEther(pending);
    } catch (err) {
      logger.warn({ err, splitterAddress }, 'Failed to fetch on-chain pending release');
      return '0';
    }
  }

  async getUserEarnings(userId: string) {
    const payouts = await prisma.mpesaPayout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    const total = payouts
      .filter((p) => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + Number(p.amountKes), 0);
    return { total, payouts };
  }

  async listDistributions(songId: string) {
    return prisma.royaltyDistribution.findMany({
      where: { songId },
      orderBy: { createdAt: 'desc' },
      include: { mpesaPayouts: true },
    });
  }
}

export const royaltyService = new RoyaltyService();
