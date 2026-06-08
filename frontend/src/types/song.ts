export type SongStatus = 'DRAFT' | 'PROCESSING' | 'MINTED' | 'FAILED';

export interface SongCollaborator {
  id: string;
  userId: string;
  shareBps: number;
  user: { id: string; email?: string; walletAddress?: string | null };
}

export interface Song {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  durationSec?: number;
  artistId: string;
  ipfsAudioHash?: string;
  ipfsCoverHash?: string;
  ipfsMetadataUri?: string;
  tokenId?: string;
  contractAddress?: string;
  splitterAddress?: string;
  status: SongStatus;
  releaseDate?: string;
  createdAt: string;
  artist?: { id: string; artistProfile?: { displayName: string; avatarUrl?: string } };
  collaborators?: SongCollaborator[];
}
