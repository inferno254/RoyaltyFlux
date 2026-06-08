export interface User {
  id: string;
  email: string;
  role: 'ARTIST' | 'COLLABORATOR' | 'LISTENER' | 'ADMIN';
  walletAddress: string | null;
  phone?: string;
  isVerified?: boolean;
  artistProfile?: ArtistProfile | null;
}

export interface ArtistProfile {
  id: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  verified: boolean;
  totalEarnings: string;
  totalStreams: string;
}
