import { db } from '@api/db/prisma';
import PetCacheRepository from '@api/repository/petCacheRepository';
import {
  CreatePetInput,
  DeletePetInput,
  GetPetInput,
  UpdatePetInput,
} from '@api/schema/pet.schema';
import logger from '@api/utils/logger';
import { Pet } from '@prisma/client';

export default class PetService {
  private readonly petCacheRepository: PetCacheRepository;

  constructor() {
    this.petCacheRepository = new PetCacheRepository();
  }

  async getPets(
    page?: number,
    pageSize?: number,
    sortOrder?: 'asc' | 'desc',
  ): Promise<{ pets: Pet[]; totalResults: number }> {
    const { pets: cachedPets, totalResults: tr } =
      await this.petCacheRepository.getPets(page, pageSize, sortOrder);

    if (!cachedPets.length) {
      logger.warn('No cached pets found, fetching from db');
      const pets = await db.pet.findMany();
      logger.info(`found ${pets.length} pets from DB`);

      await this.petCacheRepository.setPets(pets);

      const { pets: updatedCache, totalResults } =
        await this.petCacheRepository.getPets(page, pageSize, sortOrder);

      return {
        pets: updatedCache,
        totalResults,
      };
    }

    return {
      pets: cachedPets,
      totalResults: tr,
    };
  }

  async getPet(id: GetPetInput['params']['id']) {
    const cachedPet = await this.petCacheRepository.getPet(id);

    if (cachedPet) {
      return cachedPet;
    }

    const pet = await db.pet.findUnique({
      where: {
        id,
      },
    });

    await this.petCacheRepository.setPet(pet as Pet);
    return pet;
  }

  async createPet(pet: CreatePetInput['body'], userId: string) {
    const newPet = await db.pet.create({
      data: {
        ...pet,
        creatorId: userId,
      },
    });

    await this.petCacheRepository.setPet(newPet);
    return newPet;
  }

  async updatePet(
    id: UpdatePetInput['params']['id'],
    pet: UpdatePetInput['body'],
  ) {
    const updatedPet = await db.pet.update({
      where: {
        id: id.toString(),
      },
      data: {
        ...pet,
      },
    });

    await this.petCacheRepository.removePet(updatedPet.id);

    return updatedPet;
  }

  async deletePet(id: DeletePetInput['params']['id']) {
    try {
      await Promise.allSettled([
        db.pet.delete({ where: { id: id.toString() } }),
        this.petCacheRepository.removePet(id),
      ]);
      return null;
    } catch (error) {
      logger.error(`Failed to delete pet: ${error}`, {
        tag: 'pet',
      });
      throw error;
    }
  }
}
