import 'reflect-metadata';
import CreateServer from './server';
import { envSchema } from './util/env';
import logger from './utils/logger';

class Main {
  private async validateEnvironmentVariables() {
    const environmentVariables = envSchema.safeParse({
      PORT: process.env.PORT,
      POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
      POSTGRES_USER: process.env.POSTGRES_USER,
      POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,

      // redis
      REDIS_HOTNAME: process.env.REDIS_HOTNAME,
      REDIS_PORT: process.env.REDIS_PORT,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    });
    if (!environmentVariables.success) {
      logger.error(
        `${JSON.stringify(environmentVariables.error.issues, null, 2)}`,
      );
      throw new Error('issue reading environment variables');
    } else {
      logger.info('parsed env variables succesfully');
    }
  }

  public async start() {
    await this.validateEnvironmentVariables();
    const app = CreateServer.init();
    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
    });
  }
}

const main = new Main();
main.start();
