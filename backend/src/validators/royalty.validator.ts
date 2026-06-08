import { z } from 'zod';

export const streamQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    songId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  }),
});

export const streamCreateSchema = z.object({
  body: z.object({
    songId: z.string().uuid(),
  }),
});
