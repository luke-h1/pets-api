import { Pet } from '@prisma/client';
import RedisDatabase from '../db/redis';
import logger from '../utils/logger';

export default class PetCacheRepository {
  private readonly redis: typeof RedisDatabase;

  constructor() {
    this.redis = RedisDatabase;
  }

  async getPets(sortOrder?: 'asc' | 'desc'): Promise<Pet[] | null> {
    const db = this.redis.getInstance();

    const cachedPets = await db.get('pets');

    if (!cachedPets) {
      logger.info(`[REDIS]: pets not found in cache`, { tag: 'redis' });
      return null;
    }
    logger.info(`[REDIS]: pets found in cache`, {
      tag: 'redis',
    });

    const parsedPets = this.cacheToJSON(cachedPets);

    if (sortOrder === 'asc') {
      parsedPets.sort((a: Pet, b: Pet) => {
        return a.createdAt < b.createdAt ? -1 : 1;
      });
    } else if (sortOrder === 'desc') {
      parsedPets.sort((a: Pet, b: Pet) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      });
    }
    return parsedPets;
  }

  async setPet(pet: Pet): Promise<void> {
    const db = this.redis.getInstance();
    await db.set(`pets:${pet.id}`, JSON.stringify(pet));
  }

  async setPets(pets: Pet[]): Promise<void> {
    const db = this.redis.getInstance();
    await db.set('pets', JSON.stringify(pets));
  }

  async getPet(id: string): Promise<Pet[] | null> {
    const db = this.redis.getInstance();
    const cachedPet = await db.get(`pets:${id}`);

    if (!cachedPet) {
      logger.info(`[REDIS]: getPet - pet not found in cache`, { tag: 'redis' });
      return null;
    }

    logger.info(`[REDIS]: pet found in cache`, {
      tag: 'redis',
    });

    return this.cacheToJSON(cachedPet);
  }

  async getPaginatedPets(
    page: number,
    pageSize?: number,
    sortOrder?: 'asc' | 'desc',
  ): Promise<Pet[] | null> {
    const db = this.redis.getInstance();
    let ps: number;

    if (pageSize) {
      ps = pageSize;
    } else {
      ps = 25;
    }

    const start = (page - 1) * ps;
    const end = start + ps;

    const cachedPets = await db.get('pets');

    if (!cachedPets) {
      logger.info(`[REDIS]: pets not found in cache`, { tag: 'redis' });
      return null;
    }

    const parsedPets = this.cacheToJSON(cachedPets);

    if (sortOrder === 'asc') {
      parsedPets.sort((a: Pet, b: Pet) => {
        return a.createdAt < b.createdAt ? -1 : 1;
      });
    } else if (sortOrder === 'desc') {
      parsedPets.sort((a: Pet, b: Pet) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      });
    }

    return parsedPets.slice(start, end);
  }

  async deletePet(id: string): Promise<void> {
    const db = this.redis.getInstance();
    await db.del(`pets:${id}`);
  }

  async deletePets(): Promise<void> {
    const db = this.redis.getInstance();
    await db.del('pets');
  }

  private cacheToJSON(data: string[] | string) {
    if (Array.isArray(data)) {
      return data.map(item => JSON.parse(item));
    }

    return JSON.parse(data);
  }
}
