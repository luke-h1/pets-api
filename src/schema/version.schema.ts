import z from '../util/validation';

export const versionSchema = z
  .object({
    deployedAt: z.string(),
    deployedby: z.string(),
  })
  .strict();
