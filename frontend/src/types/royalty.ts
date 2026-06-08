export type MpesaStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'TIMEOUT';

export interface MpesaPayout {
  id: string;
  phone: string;
  amountKes: string;
  status: MpesaStatus;
  mpesaReceipt?: string;
  resultCode?: number;
  resultDesc?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoyaltyDistribution {
  id: string;
  songId: string;
  totalKes: string;
  totalStreams: string;
  status: 'PENDING' | 'DISTRIBUTED' | 'FAILED';
  txHash?: string;
  distributedAt?: string;
  createdAt: string;
}
