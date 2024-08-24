import z from '../utils/validation';

export const versionSchema = z
  .object({
    deployedAt: z.string(),
    deployedby: z.string(),
  })
  .strict();
