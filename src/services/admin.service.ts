import RedisDatabase from '../db/redis';
import logger from '../utils/logger';

export default class AdminService {
  private readonly redis: typeof RedisDatabase;

  constructor() {
    this.redis = RedisDatabase;
  }

  async flush(): Promise<'OK' | 'ERROR'> {
    const instance = this.redis.getInstance();
    try {
      const result = await instance.flushall();
      logger.info('Redis flushed successfully');
      return result;
    } catch (error) {
      logger.error('Failed to flush redis', error);
      return 'ERROR';
    }
  }
}
