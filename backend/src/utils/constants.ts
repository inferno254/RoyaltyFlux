export const KES_PER_USD_DEFAULT = 130;
export const MPESA_MIN_AMOUNT_KES = 1;
export const MPESA_MAX_AMOUNT_KES = 70_000;
export const STREAM_TIERS = {
  FREE: 0,
  STANDARD: 1,
  PREMIUM: 2,
  EXCLUSIVE: 3,
} as const;
export const ROYALTY_DISTRIBUTION_INTERVAL_MS = 5 * 60 * 1000; // 5 min
export const STREAM_SYNC_INTERVAL_MS = 60 * 1000; // 1 min
export const MPESA_QUERY_INTERVAL_MS = 30 * 1000; // 30s
export const UPLOAD_MAX_SIZE_MB = 100;
export const PHONE_REGEX = /^(\+?254|0)?[71]\d{8}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/;
