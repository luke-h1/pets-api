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
    await db.del(`pets:${id}`);
    const allPets = await db.get('pets');
    if (!allPets) {
      return;
    }

    const parsedPets = this.cacheToJSON(allPets);
    const updatedPets = parsedPets.filter((pet: Pet) => pet.id !== id);
    await db.set('pets', JSON.stringify(updatedPets));
  }

  async getPets(sortOrder?: 'asc' | 'desc'): Promise<Pet[] | null> {
    const db = this.redis.getInstance();

    const cachedPets = await db.get('pets');

    if (!cachedPets) {
      logger.info(`[REDIS]: pets not found in cache`, { tag: 'redis' });
      return null;
    }

    const parsedPets = this.cacheToJSON(cachedPets);

    if (!sortOrder) {
      return parsedPets;
    }

    if (sortOrder === 'asc') {
      parsedPets.sort((a: Pet, b: Pet) => {
        return a.createdAt < b.createdAt ? -1 : 1;
      });
    }
    if (sortOrder === 'desc') {
      parsedPets.sort((a: Pet, b: Pet) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      });
    }
    return null;
  }

  async setPets(pets: Pet[]) {
    const db = this.redis.getInstance();
    try {
      await db.set('pets', JSON.stringify(pets));
      const cachedPets = await db.get('pets');
      return this.cacheToJSON(cachedPets as string);
    } catch (error) {
      return null;
    }
  }

  async setPet(pet: Pet): Promise<null> {
    const db = this.redis.getInstance();
    await db.del(`pets:${pet.id}`);
    await db.set(`pets:${pet.id}`, JSON.stringify(pet));

    const allPets = await db.get('pets');
    if (!allPets) {
      logger.info(`[REDIS]: setPet - pets not found in cache!`, {
        tag: 'redis',
      });
      return null;
    }
    await db.set('pets', JSON.stringify([...this.cacheToJSON(allPets), pet]));

    logger.info(`[REDIS]: pet added to pets and pet cache tree`, {
      tag: 'redis',
    });
    return null;
  }

  async getPet(id: string): Promise<Pet[] | null> {
    const db = this.redis.getInstance();
    const cachedPet = await db.get(`pets:${id}`);

    if (!cachedPet) {
      logger.info(`[REDIS]: getPet - pet not found in cache`, { tag: 'redis' });
      return null;
    }

    logger.info(
      `[REDIS]: pet found in cache with id: ${this.cacheToJSON(cachedPet).id}`,
      {
        tag: 'redis',
      },
    );
    return this.cacheToJSON(cachedPet);
  }

  async getPaginatedPets(
    page: number,
    pageSize: number,
    sortOrder?: 'asc' | 'desc',
  ): Promise<Pet[]> {
    const db = this.redis.getInstance();

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const cachedPets = await db.get('pets');

    if (!cachedPets) {
      logger.info(`[REDIS]: pets not found in cache`, { tag: 'redis' });
      return [];
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
