export type Role = 'ARTIST' | 'ADMIN' | 'PRODUCER';
export type Genre = 'AFROBEATS' | 'KAPUKA' | 'GOSPEL' | 'R_AND_B' | 'HIPHOP' | 'REGGAE' | 'TRAP' | 'DRILL' | 'POP';
export type CollaboratorRole = 'LYRICIST' | 'COMPOSER' | 'PRODUCER' | 'ARTIST';
export type StreamSource = 'DIRECT' | 'SPOTIFY' | 'YOUTUBE' | 'TIKTOK';
export type TxType = 'ROYALTY_PAYMENT' | 'WITHDRAWAL' | 'MINT_FEE';
export type TxStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type NotificationType = 'PAYMENT' | 'STREAM' | 'VERIFIED';

export interface SocialLinks { youtube?: string; spotify?: string; tiktok?: string; instagram?: string; twitter?: string; }

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  walletAddress?: string;
  role: Role;
  mpesaNumber?: string;
  createdAt: string;
  artistProfile?: ArtistProfile;
}

export interface ArtistProfile {
  id: string;
  userId: string;
  stageName: string;
  bio?: string;
  genre: Genre;
  profileImageUrl?: string;
  coverImageUrl?: string;
  socialLinks?: SocialLinks;
  monthlyListeners: number;
  totalStreams: number;
  totalEarnings: number;
}

export interface SongCollaborator {
  id: string;
  user?: User;
  role: CollaboratorRole;
  percentage: number;
  walletAddress: string;
  earnings: number;
}

export interface Song {
  id: string;
  title: string;
  artist: User;
  genre: Genre;
  duration?: number;
  ipfsHash: string;
  audioUrl: string;
  coverImageUrl: string;
  nftTokenId?: number;
  isMinted: boolean;
  isPublished: boolean;
  totalStreams: number;
  totalEarnings: number;
  collaborators: SongCollaborator[];
  releaseDate: string;
  createdAt: string;
}

export interface Stream { id: string; songId: string; source: StreamSource; isVerified: boolean; royaltyAmount: number; streamDate: string; }
export interface Transaction { id: string; type: TxType; amount: number; currency: string; status: TxStatus; mpesaReceiptNumber?: string; txHash?: string; createdAt: string; }
export interface Notification { id: string; type: NotificationType; title: string; body: string; isRead: boolean; createdAt: string; }

export interface PaginatedResponse<T> { data: T[]; total: number; page: number; pages: number; }
