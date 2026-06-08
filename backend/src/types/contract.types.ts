export interface MintSongRequest {
  artistAddress: string;
  tokenURI: string;
  collaborators: string[];
  sharesBps: number[];
  songHash: string;
}

export interface RoyaltyInfo {
  tokenId: string;
  artist: string;
  songHash: string;
  splitter: string;
  totalStreams: string;
  mintedAt: number;
}

export interface ChainConfig {
  rpc: string;
  chainId: number;
  contractAddress: string;
  oracleAddress: string;
}
