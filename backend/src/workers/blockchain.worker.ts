import { ethers } from 'ethers';
import { provider } from '../config/blockchain';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { SongStatus } from '@prisma/client';
import { getRedis } from '../config/redis';
import { syncBlockchainOnStartup } from './notification.service';

const chainListeners: Map<string, ethers.Contract> = new Map();

export async function startBlockchainWorker() {
  await syncBlockchainOnStartup();
  if (!process.env.CONTRACT_ADDRESS) return;

  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    [
      'event SongMinted(uint256 indexed tokenId, address indexed artist, address indexed splitter, bytes32 songHash, uint256 timestamp)',
      'event StreamsRecorded(uint256 indexed tokenId, uint256 streamCount, uint256 totalStreams, address indexed oracle)',
    ],
    provider,
  );

  contract.on('SongMinted', (tokenId, artist, splitter, songHash, ts) => {
    logger.info({ tokenId: tokenId.toString(), artist, splitter }, 'On-chain SongMinted');
  });

  contract.on('StreamsRecorded', (tokenId, count, total, oracle) => {
    logger.info({ tokenId: tokenId.toString(), count: count.toString(), total: total.toString() }, 'Streams recorded');
    getRedis().publish(
      'streams:recorded',
      JSON.stringify({ tokenId: tokenId.toString(), count: count.toString(), total: total.toString() }),
    );
  });

  chainListeners.set('main', contract);
}

export async function stopBlockchainWorker() {
  for (const c of chainListeners.values()) c.removeAllListeners();
  chainListeners.clear();
}
