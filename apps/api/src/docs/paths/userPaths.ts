import { linksSchema, paginatedLinksSchema } from '@api/schema/links.schema';
import { responseSchema } from '@api/schema/response.schema';
import { updateUserSchema, userSchema } from '@api/schema/user.schema';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

const registerUserPaths = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/api/users',
    description: 'Get all users',
    summary: 'Get all users',
    request: {
      query: z.object({
        page: z.number().optional(),
        pageSize: z.number().optional(),
        order: z.enum(['asc', 'desc']).optional(),
      }),
    },
    responses: {
      200: {
        description: 'List of users',
        content: {
          'application/json': {
            schema: z.object({
              users: userSchema.array(),
              _links: linksSchema,
              paging: paginatedLinksSchema,
            }),
          },
        },
      },
    },
    tags: ['user'],
  });
  registry.registerPath({
    method: 'get',
    path: '/api/users/{id}',
    description: 'fetch user by id',
    summary: 'Fetch user by id',
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'User found',
        content: {
          'application/json': {
            schema: userSchema,
          },
        },
      },
      404: {
        description: 'User not found',
        content: {
          'application/json': {
            schema: responseSchema,
          },
        },
      },
    },
    tags: ['user'],
  });
  registry.registerPath({
    path: '/api/users/{id}',
    method: 'patch',
    description: 'update user details',
    summary: 'update parts of user',
    request: {
      body: {
        content: {
          'application/json': {
            schema: updateUserSchema,
          },
        },
      },
      cookies: z.object({
        'connect.sid': z.string(),
      }),
    },
    responses: {
      200: {
        description: 'user updated',
        content: {
          'application/json': { schema: userSchema },
        },
      },
      404: {
        description: 'user not found',
        content: {
          'application/json': { schema: responseSchema },
        },
      },
      401: {
        description: 'not authorized',
        content: {
          'application/json': { schema: responseSchema },
        },
      },
    },
    tags: ['user'],
  });
};
export default registerUserPaths;
