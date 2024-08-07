import 'reflect-metadata';
import CreateServer from './server';
import { envSchema } from './util/env';
import logger from './utils/logger';

class Main {
  private async validateEnvironmentVariables() {
    const environmentVariables = envSchema.safeParse({
      PORT: process.env.PORT,

      // postgres
      DATABASE_URL: process.env.DATABASE_URL,

      // redis
      REDIS_HOTNAME: process.env.REDIS_HOTNAME,
      REDIS_PORT: process.env.REDIS_PORT,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,

      // version
      DEPLOYED_AT: process.env.DEPLOYED_AT,
      DEPLOYED_BY: process.env.DEPLOYED_BY,
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
