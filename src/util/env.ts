import z from './validation';

export const envSchema = z.object({
  API_BASE_URL: z.string().default('http://localhost:8000'),
  PORT: z.string().default('8000'),
  // postgres
  DATABASE_URL: z
    .string()
    .default('postgresql://pets:pets@localhost:5432/pets?schema=public'),

  // redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  SESSION_SECRET: z.string().default('pets'),
  DEPLOYED_AT: z.string().default(new Date().getTime().toString()),
  DEPLOYED_BY: z.string().default('luke-h1'),
  ENVIRONMENT: z.enum(['local', 'staging', 'production']),
});

export type Env = z.infer<typeof envSchema>;
