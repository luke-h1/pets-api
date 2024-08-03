import Database from '../db/database';
import RedisDatabase from '../db/redis';
import logger from '../utils/logger';

export default class HealthService {
  private readonly db: typeof Database;

  private readonly redis: typeof RedisDatabase;

  constructor() {
    this.db = Database;
    this.redis = RedisDatabase;
  }

  async health(): Promise<{ db: boolean; cache: boolean }> {
    const orm = await this.db.getInstance();
    const ok = orm.isInitialized;
    let cacheMsg = '';

    try {
      const cache = await this.redis.ping();
      cacheMsg = cache;
    } catch (error) {
      logger.error(`Cache connection error: ${error}`);
    }

    const cacheOk = cacheMsg === 'PONG';
    logger.info(`DB connection check result -> DB: ${ok}, cache: ${cacheOk}`);

    return {
      db: ok,
      cache: cacheOk,
    };
  }
}
