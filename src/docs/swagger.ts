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

const openApiSpec = () =>
  generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Pets adoption API',
      version: pkg.version,
      description: 'Restful API for pet adoptions',
    },
    servers: [
      {
        description: 'Local server',
        url: 'http://localhost:8000',
      },
      {
        description: 'dev server',
        url: 'https://pets-staging.lhowsam.com',
      },
    ],
  });
export default openApiSpec;
