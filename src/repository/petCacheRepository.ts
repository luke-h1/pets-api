import RedisDatabase from '@api/db/redis';
import logger from '@api/utils/logger';
import { Pet } from '@prisma/client';

export default class PetCacheRepository {
  private readonly redis: typeof RedisDatabase;

  constructor() {
    this.redis = RedisDatabase;
  }

  async removePet(id: string): Promise<void> {
    const db = this.redis.getInstance();
    const pipeline = db.pipeline();

    pipeline.del(`pets:${id}`);
    pipeline.del('pets');
    await pipeline.exec();

    const allPets = await db.get('pets');

    if (!allPets) {
      return;
    }

    const parsedPets = this.cacheToJSON(allPets);
    const updatedPets = parsedPets.filter((pet: Pet) => pet.id !== id);
    await db.set('pets', JSON.stringify(updatedPets));
  }

  async getPets(
    page?: number,
    pageSize?: number,
    sortOrder?: 'asc' | 'desc',
  ): Promise<{ pets: Pet[]; totalResults: number }> {
    const db = this.redis.getInstance();

    const cachedPets = await db.get('pets');

    if (!cachedPets) {
      return {
        pets: [],
        totalResults: 0,
      };
    }

    let parsedPets = this.cacheToJSON(cachedPets as string) as Pet[];

    if (page && pageSize) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      parsedPets = parsedPets.slice(start, end);
    }

    switch (sortOrder) {
      case 'asc': {
        parsedPets.sort((a: Pet, b: Pet) => {
          return a.createdAt < b.createdAt ? -1 : 1;
        });
        return {
          pets: parsedPets,
          totalResults: parsedPets.length,
        };
      }

      case 'desc': {
        parsedPets.sort((a: Pet, b: Pet) => {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        return {
          pets: parsedPets,
          totalResults: parsedPets.length,
        };
      }

      default: {
        return {
          pets: parsedPets,
          totalResults: parsedPets.length,
        };
      }
    }
  }

  async setPets(pets: Pet[]) {
    const db = this.redis.getInstance();
    await db.set('pets', JSON.stringify(pets));
    const cachedPets = await db.get('pets');
    return this.cacheToJSON(cachedPets as string);
  }

  async setPet(pet: Pet) {
    const db = this.redis.getInstance();
    await db.del(`pets:${pet.id}`);
    await db.set(`pets:${pet.id}`, JSON.stringify(pet));

    const allPets = await db.get('pets');
    if (!allPets) {
      logger.info(`[REDIS]: setPet - pets not found in cache!`);
      return null;
    }

    // await db.set('pets', JSON.stringify([...this.cacheToJSON(allPets), pet]));

    const mergedPets = [...this.cacheToJSON(allPets), pet];

    await db.set('pets', JSON.stringify(mergedPets));

    logger.info(`[REDIS]: pet added to pets and pet cache tree`);
    return null;
  }

  async getPet(id: string): Promise<Pet | null> {
    const db = this.redis.getInstance();
    const cachedPet = await db.get(`pets:${id}`);

    if (!cachedPet) {
      logger.info(`[REDIS]: getPet - pet not found in cache`);
      return null;
    }

    logger.info(`[REDIS]: pet found in cache with id: ${id}`);
    return this.cacheToJSON(cachedPet);
  }

  async deletePet(id: string): Promise<void> {
    const db = this.redis.getInstance();
    await db.del(`pets:${id}`);
  }

  async deletePets(): Promise<void> {
    const db = this.redis.getInstance();
    await db.del('pets');
  }

  private cacheToJSON(data: string[] | unknown[] | string | null) {
    if (Array.isArray(data)) {
      return data.map(item =>
        JSON.parse(typeof item === 'string' ? item : JSON.stringify(item)),
      );
    }

    if (!data || typeof data === 'undefined') {
      logger.warn('no data passed to cacheToJSON');
      // eslint-disable-next-line consistent-return
      return;
    }

    return JSON.parse(data);
  }
}
