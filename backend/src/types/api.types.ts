export interface RegisterDto {
  email: string;
  password: string;
  phone?: string;
  walletAddress?: string;
  role?: 'ARTIST' | 'COLLABORATOR' | 'LISTENER';
  displayName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    walletAddress: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

export interface SongUploadDto {
  title: string;
  description?: string;
  genre?: string;
  collaborators: { userId: string; shareBps: number }[];
  releaseDate?: string;
}

export interface RoyaltyWithdrawDto {
  amount: number;
  phone: string;
}
