import { DataSource } from 'typeorm';
import logger from '../utils/logger';
import { dataSource } from './app-data-source';

class Database {
  public instance: DataSource | null;

  constructor() {
    this.instance = null;
  }

  public async getInstance() {
    if (!this.instance) {
      this.instance = await dataSource.initialize();
      logger.info(`Connected to db`, { tags: 'db' });
    }
    return this.instance;
  }

  public async runMigrations() {
    const db = await this.getInstance();
    const migrations = await db.runMigrations({ transaction: 'all' });
    logger.info(`ran ${migrations.length} migration(s)`);
  }
}
export default new Database();
