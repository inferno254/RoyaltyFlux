import { z } from 'zod';
import { WALLET_REGEX } from '../utils/constants';

export const mintSongSchema = z.object({
  body: z.object({
    songId: z.string().uuid(),
    artistAddress: z.string().regex(WALLET_REGEX),
  }),
});

export const recordStreamsSchema = z.object({
  body: z.object({
    songId: z.string().uuid(),
    streamCount: z.number().int().min(1).max(1_000_000),
  }),
});
