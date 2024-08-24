import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { responseSchema } from '../../schema/response.schema';

const adminPaths = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'post',
    path: '/api/admin/flush',
    description: 'Flushes redis cache',
    summary: 'Flush redis cache (ADMIN only)',
    responses: {
      200: {
        description: 'Redis cache flushed',
        content: {
          'application/json': {
            schema: z.object({
              result: z.literal('OK'),
            }),
          },
        },
      },
      500: {
        description: 'Error encountered when flushing redis cache',
        content: {
          'application/json': {
            schema: z.object({
              result: z.literal('ERROR'),
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    },
    tags: ['admin'],
  });
};
export default adminPaths;
