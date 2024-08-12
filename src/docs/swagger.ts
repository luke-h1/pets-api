import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import pkg from '../../package.json';
import authPaths from './paths/authPaths';
import healthPaths from './paths/healthPaths';
import registerPetPaths from './paths/petPaths';
import versionPaths from './paths/versionPaths';

const registry = new OpenAPIRegistry();

// pets
registerPetPaths(registry);

// version
versionPaths(registry);

// health
healthPaths(registry);

// auth
authPaths(registry);

const generator = new OpenApiGeneratorV3(registry.definitions);

const openApiSpec = (url: string) =>
  generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Pets adoption API',
      version: pkg.version,
      description: 'Restful API for pet adoptions',
    },
    servers: [
      {
        url,
      },
    ],
  });
export default openApiSpec;