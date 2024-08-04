import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().default('8000'),
  // postgres
  DATABASE_URL: z
    .string()
    .default('postgresql://pets:pets@localhost:5432/pets?schema=public'),

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
