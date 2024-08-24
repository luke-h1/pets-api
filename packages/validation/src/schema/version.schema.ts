import z from '@validation/util/openApiZod';

export const versionSchema = z
  .object({
    deployedAt: z.string(),
    deployedby: z.string(),
  })
  .strict();
