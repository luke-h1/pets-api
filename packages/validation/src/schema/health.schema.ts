import z from '@validation/util/openApiZod';

export const healthSchema = z.object({
  db: z.boolean(),
  cache: z.boolean(),
  status: z.string(),
});
