import { prisma } from '../config/database';
import { getRoyaltyNFTContractWithSigner, provider } from '../config/blockchain';
import { ApiError } from '../utils/errors';
import { logger } from '../config/logger';
import { SongStatus } from '@prisma/client';
import { ethers } from 'ethers';
import { songService } from './song.service';

export class NftService {
  async mintSong(songId: string, artistAddress: string) {
    const song = await songService.getById(songId);
    if (song.status === SongStatus.MINTED) throw ApiError.badRequest('Already minted');
    if (!song.ipfsMetadataUri) throw ApiError.badRequest('Metadata not built yet');

    const tokenURI = `ipfs://${song.ipfsMetadataUri}/metadata.json`;
    const collaborators = song.collaborators.map((c) => c.user.walletAddress).filter(Boolean) as string[];
    if (collaborators.length === 0) {
      throw ApiError.badRequest('Collaborators must have wallet addresses');
    }
    const sharesBps = song.collaborators.map((c) => c.shareBps);
    const songHash = ethers.id(song.ipfsMetadataUri);

    const contract = getRoyaltyNFTContractWithSigner();
    let tx: ethers.TransactionResponse;
    try {
      tx = await contract.mintSong(artistAddress, tokenURI, collaborators, sharesBps, songHash);
    } catch (err) {
      logger.error({ err }, 'mintSong failed');
      await prisma.song.update({ where: { id: songId }, data: { status: SongStatus.FAILED } });
      throw ApiError.internal('On-chain mint failed');
    }

    const receipt = await tx.wait();
    if (!receipt) throw ApiError.internal('Transaction not mined');

    // Parse SongMinted event
    const iface = new ethers.Interface([
      'event SongMinted(uint256 indexed tokenId, address indexed artist, address indexed splitter, bytes32 songHash, uint256 timestamp)',
    ]);
    const log = receipt.logs
      .map((l) => {
        try {
          return iface.parseLog(l);
        } catch {
          return null;
        }
      })
      .find((p) => p?.name === 'SongMinted');

    const tokenId = log?.args?.tokenId as bigint | undefined;
    const splitter = log?.args?.splitter as string | undefined;
    if (!tokenId || !splitter) {
      throw ApiError.internal('Could not parse SongMinted event');
    }

    await prisma.song.update({
      where: { id: songId },
      data: {
        status: SongStatus.MINTED,
        tokenId,
        splitterAddress: splitter,
      },
    });

    logger.info({ songId, tokenId: tokenId.toString(), txHash: receipt.hash }, 'Song minted');
    return { tokenId: tokenId.toString(), splitterAddress: splitter, txHash: receipt.hash };
  }

  async recordStreams(songId: string, streamCount: number) {
    const song = await songService.getById(songId);
    if (song.status !== SongStatus.MINTED || !song.tokenId) {
      throw ApiError.badRequest('Song not minted yet');
    }
    const contract = getRoyaltyNFTContractWithSigner();
    const tx = await contract.recordStreams(song.tokenId, streamCount);
    const receipt = await tx.wait();

    await prisma.stream.updateMany({
      where: { songId, reportedOnChain: false },
      data: { reportedOnChain: true, txHash: receipt?.hash },
    });
    return { txHash: receipt?.hash };
  }

  async getOnChainInfo(tokenId: string) {
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS!,
      [
        'function getSongInfo(uint256 tokenId) external view returns (tuple(address artist, bytes32 songHash, address splitter, uint256 mintedAt, uint256 totalStreams))',
        'function ownerOf(uint256 tokenId) external view returns (address)',
        'function tokenURI(uint256 tokenId) external view returns (string)',
      ],
      provider,
    );
    const [info, owner, tokenURI] = await Promise.all([
      contract.getSongInfo(tokenId),
      contract.ownerOf(tokenId),
      contract.tokenURI(tokenId),
    ]);
    return {
      artist: info.artist,
      songHash: info.songHash,
      splitter: info.splitter,
      mintedAt: Number(info.mintedAt),
      totalStreams: info.totalStreams.toString(),
      owner,
      tokenURI,
    };
  }
}

export const nftService = new NftService();
