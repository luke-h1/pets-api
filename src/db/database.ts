import { MikroORM } from '@mikro-orm/postgresql';
import logger from '../utils/logger';

class Database {
  public instance: MikroORM | null;

  constructor() {
    this.instance = null;
  }

  public async getInstance() {
    if (!this.instance) {
      this.instance = await MikroORM.init();
    }

    return this.instance;
  }

  public async runMigrations() {
    const db = await this.getInstance();
    const migrator = db.getMigrator();

    const pendingMigrations = await migrator.getPendingMigrations();
    logger.info(`running ${pendingMigrations.length} migration(s)`);

    await migrator.up();
  }
}
export default new Database();
