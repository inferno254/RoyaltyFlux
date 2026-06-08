import { ethers } from 'ethers';
import { env } from './env';
import { logger } from './logger';

export const provider = new ethers.JsonRpcProvider(env.AVALANCHE_RPC, env.CHAIN_ID);

export const ROYALTY_NFT_ABI = [
  'function mintSong(address artist, string tokenURI, address[] collaborators, uint256[] sharesBps, bytes32 songHash) external returns (uint256)',
  'function recordStreams(uint256 tokenId, uint256 streamCount) external',
  'function getSongInfo(uint256 tokenId) external view returns (tuple(address artist, bytes32 songHash, address splitter, uint256 mintedAt, uint256 totalStreams))',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function balanceOf(address) external view returns (uint256)',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  'event SongMinted(uint256 indexed tokenId, address indexed artist, address indexed splitter, bytes32 songHash, uint256 timestamp)',
  'event StreamsRecorded(uint256 indexed tokenId, uint256 streamCount, uint256 totalStreams, address indexed oracle)',
];

export const ROYALTY_SPLITTER_ABI = [
  'function release(address payable account) external',
  'function releaseAll() external',
  'function pendingRelease(address account) external view returns (uint256)',
  'function payeeCount() external view returns (uint256)',
  'function payee(uint256 index) external view returns (address)',
  'function shares(address account) external view returns (uint256)',
  'function released(address account) external view returns (uint256)',
];

export const MPESA_ORACLE_ABI = [
  'function getKesUsdRate() external view returns (uint256, bool)',
  'function computePayout(uint8 tier, uint256 streamCount) external view returns (uint256)',
  'function tierRate(uint8 tier) external view returns (uint256)',
];

export function getRoyaltyNFTContract() {
  return new ethers.Contract(env.CONTRACT_ADDRESS, ROYALTY_NFT_ABI, provider);
}

export function getRoyaltyNFTContractWithSigner() {
  if (!env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY not set — cannot sign transactions');
  }
  const wallet = new ethers.Wallet(env.PRIVATE_KEY, provider);
  return new ethers.Contract(env.CONTRACT_ADDRESS, ROYALTY_NFT_ABI, wallet);
}

export function getMpesaOracleContract() {
  return new ethers.Contract(env.ORACLE_ADDRESS, MPESA_ORACLE_ABI, provider);
}

logger.info({ chainId: env.CHAIN_ID, rpc: env.AVALANCHE_RPC }, 'Blockchain provider initialized');
