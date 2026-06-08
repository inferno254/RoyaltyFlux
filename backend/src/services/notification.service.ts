import { logger } from '../config/logger';
import { provider } from '../config/blockchain';
import { prisma } from '../config/database';
import { ethers } from 'ethers';
import { env } from '../config/env';
import { getRoyaltyNFTContract } from '../config/blockchain';
import { SongStatus } from '@prisma/client';
import { NotificationSocket } from '../sockets/notification.socket';

export async function syncBlockchainOnStartup() {
  // Verify RPC connectivity
  try {
    const block = await provider.getBlockNumber();
    logger.info({ block }, 'Blockchain RPC reachable');
  } catch (err) {
    logger.error({ err }, 'Cannot reach blockchain RPC');
    return;
  }

  // Backfill missing tokenIds
  const songs = await prisma.song.findMany({
    where: { status: SongStatus.MINTED, tokenId: null },
    select: { id: true, ipfsMetadataUri: true },
  });
  if (songs.length === 0) return;

  try {
    const contract = getRoyaltyNFTContract();
    const filter = contract.filters.SongMinted();
    const events = await contract.queryFilter(filter, -10000);
    for (const song of songs) {
      const evt = events.find(
        (e) => 'args' in e && e.args && e.args.songHash === ethers.id(song.ipfsMetadataUri ?? ''),
      );
      if (evt && 'args' in evt && evt.args) {
        await prisma.song.update({
          where: { id: song.id },
          data: {
            tokenId: evt.args.tokenId as bigint,
            splitterAddress: evt.args.splitter as string,
          },
        });
        NotificationSocket.push('admin', { type: 'BACKFILL', title: `Token id backfilled for ${song.id}` });
      }
    }
  } catch (err) {
    logger.warn({ err }, 'Backfill failed');
  }
}
