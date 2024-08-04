// import Redis from 'ioredis';

import { Redis } from 'ioredis';
import isNumber from 'lodash/isNumber';
import testRedis from '../test/redis';
import logger from '../utils/logger';

type RedisExpireOptions = {
  token: 'EX' | 'PX' | 'EXAT' | 'PXAT' | 'KEEPTTL';
  time: number;
};

class RedisDatabase {
  public instance: Redis | null;

  constructor() {
    this.instance = null;
  }

  public getInstance() {
    if (!this.instance) {
      this.instance =
        process.env.NODE_ENV === 'test'
          ? testRedis
          : new Redis({
              host: process.env.REDIS_HOTNAME,
              port: process.env.REDIS_PORT,
              password: process.env.REDIS_PASSWORD,
              keyPrefix: 'pets',
            });
    }
    return this.instance;
  }

  public async get<TData>(key: string): Promise<TData | null> {
    const db = this.getInstance();
    try {
      const result = await db.get(key);
      logger.info(`got ${key} item successfully`, { tag: 'redis' });
      return result as TData;
    } catch (e) {
      logger.error(`Error getting key ${key}, error -> ${e}`, {
        tag: 'Redis',
      });
      return null;
    }
  }

  public async getAll<TData>(namespace: string): Promise<TData[]> {
    try {
      const keys = await this.getKeys(namespace);

      if (Array.isArray(keys)) {
        const prefix = 'pets';

        if (Array.isArray(keys)) {
          const results = await Promise.all(
            keys.map(async key => {
              return this.get(key.replace(`${prefix}:`, ''));
            }),
          );
          return results as TData[];
        }
      }
    } catch (e) {
      logger.error(
        `Error getting all keys for namespace ${namespace}, error -> ${e}`,
        {
          tag: 'redis',
        },
      );
      return [];
    }
    return [];
  }

  public async set(key: string, data: string): Promise<boolean> {
    const db = this.getInstance();
    try {
      const result = await db.set(key, data);
      logger.info(`set ${key} successfully`, { tag: 'redis' });
      return result === 'OK';
    } catch (e) {
      logger.error(`Error setting key ${key}, error -> ${e}`, {
        tag: 'Redis',
      });
      return false;
    }
  }

  public async setWithExpr(
    key: string,
    data: string,
    expireOptions: RedisExpireOptions,
  ): Promise<boolean> {
    try {
      const db = this.getInstance();
      const result = await db.set(key, data, 'EX', expireOptions.time);
      return result === 'OK';
    } catch (e) {
      logger.error(
        `Error setting key ${key} with expr ${expireOptions.time}, error -> ${e}`,
        {
          tag: 'Redis',
        },
      );
      return false;
    }
  }

  public async getKeys(namespace?: string) {
    const db = this.getInstance();

    if (namespace) {
      return db.keys(`${namespace}*`);
    }

    return db.keys('*');
  }

  public async deleteItem(key: string): Promise<boolean> {
    const db = this.getInstance();
    try {
      const result = await db.del(key);
      return isNumber(result);
    } catch (e) {
      logger.error(`Failed to delete item with key: ${key}`);
      return false;
    }
  }

  public async ping(): Promise<string> {
    const db = this.getInstance();
    const result = await db.ping();
    return result;
  }
}
export default new RedisDatabase();
