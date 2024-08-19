import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import pkg from '../../package.json';
import authPaths from './paths/authPaths';
import healthPaths from './paths/healthPaths';
import imagePaths from './paths/imagePaths';
import registerPetPaths from './paths/petPaths';
import versionPaths from './paths/versionPaths';

const registry = new OpenAPIRegistry();

// pets
registerPetPaths(registry);

// auth
authPaths(registry);

// images
imagePaths(registry);

// version
versionPaths(registry);

// health
healthPaths(registry);

const generator = new OpenApiGeneratorV3(registry.definitions);

const openApiSpec = () =>
  generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Pets adoption API',
      version: pkg.version,
      description: 'Restful API for pet adoptions',
    },
  });
export default openApiSpec;
