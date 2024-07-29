import 'reflect-metadata';

import dotenv from 'dotenv';
import CreateServer from './server';
import logger from './utils/logger';

dotenv.config();

class Main {
  public static start(): void {
    const app = CreateServer.init();
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
    });
  }
}

Main.start();
