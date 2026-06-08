import { z } from 'zod';

export const uploadQuerySchema = z.object({
  query: z.object({
    type: z.enum(['audio', 'image']).default('audio'),
  }),
});
