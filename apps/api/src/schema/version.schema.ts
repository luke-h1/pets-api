import z from '@api/utils/validation';

export const versionSchema = z
  .object({
    deployedAt: z.string(),
    deployedBy: z.string(),
    gitSha: z.string(),
  })
  .strict();
