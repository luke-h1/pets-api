import z from './validation';

export const envSchema = z.object({
  API_BASE_URL: z.string().default('http://localhost'),
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
  DEPLOYED_AT: z.string().default(new Date().getTime().toString()),
  DEPLOYED_BY: z.string().default('luke-h1'),
  ENVIRONMENT: z.enum(['local', 'staging', 'production']),
});

export type Env = z.infer<typeof envSchema>;
