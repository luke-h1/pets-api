import z from '../utils/validation';

export const healthSchema = z.object({
  db: z.boolean(),
  cache: z.boolean(),
  status: z.string(),
});
