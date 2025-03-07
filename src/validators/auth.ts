import { z } from 'zod';

export const validationCode = z.object({
  code: z.string().min(1, 'Authorization code is required'),
});
