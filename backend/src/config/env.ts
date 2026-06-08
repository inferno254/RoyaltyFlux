import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  AVALANCHE_RPC: z.string().url().default('https://api.avax-test.network/ext/bc/C/rpc'),
  CHAIN_ID: z.coerce.number().int().default(43113),
  CONTRACT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).default('0x0000000000000000000000000000000000000000'),
  PRIVATE_KEY: z.string().default(''),
  BACKEND_SIGNER_ADDRESS: z.string().default(''),

  IPFS_GATEWAY: z.string().url().default('https://ipfs.io/ipfs/'),
  IPFS_PROJECT_ID: z.string().default(''),
  IPFS_PROJECT_SECRET: z.string().default(''),
  PINATA_JWT: z.string().default(''),

  ORACLE_ADDRESS: z.string().default('0x0000000000000000000000000000000000000000'),

  REDIS_URL: z.string().default('redis://localhost:6379'),

  MPESA_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  MPESA_CONSUMER_KEY: z.string().default(''),
  MPESA_CONSUMER_SECRET: z.string().default(''),
  MPESA_PASSKEY: z.string().default(''),
  MPESA_SHORTCODE: z.string().default('174379'),
  MPESA_CALLBACK_URL: z.string().default(''),

  SENTRY_DSN: z.string().default(''),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.string().default('info'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().default(100),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof EnvSchema>;
