import { versionSchema } from '@api/schema/version.schema';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

const versionPaths = (registry: OpenAPIRegistry) => {
  registry.registerPath({
    method: 'get',
    path: '/api/version',
    description:
      'Get current version of API as well as who deployed this version',
    summary: 'Get version of currently deployed API',
    responses: {
      200: {
        description: 'version of api and user who deployed it',
        content: {
          'application/json': {
            schema: versionSchema,
          },
        },
      },
    },
    tags: ['version'],
  });
};
export default versionPaths;
