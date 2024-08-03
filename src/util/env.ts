import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().default('8000'),
  // postgres
  POSTGRES_DB_NAME: z.string().default('pets'),
  POSTGRES_USER: z.string().default('pets'),
  POSTGRES_PASSWORD: z.string().default('pets'),

  // redis
  REDIS_HOTNAME: z.string().default('localhost'),
  REDIS_PORT: z
    .string()
    .default('6379')
    .transform(v => parseInt(v, 10)),
  REDIS_PASSWORD: z.string().default('pets'),
  SESSION_SECRET: z.string().default('pets'),
});

export type Env = z.infer<typeof envSchema>;
