import { z } from 'zod';

export const artistProfileSchema = z.object({
  body: z.object({
    displayName: z.string().min(2).max(80),
    bio: z.string().max(2000).optional(),
    avatarUrl: z.string().url().optional(),
    coverUrl: z.string().url().optional(),
  }),
});

export const artistUpdateSchema = z.object({
  body: z.object({
    displayName: z.string().min(2).max(80).optional(),
    bio: z.string().max(2000).optional(),
    avatarUrl: z.string().url().optional(),
    coverUrl: z.string().url().optional(),
  }),
});
