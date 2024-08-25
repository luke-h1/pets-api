import { db } from '@api/db/prisma';
import PetCacheRepository from '@api/repository/petCacheRepository';
import {
  CreatePetInput,
  DeletePetInput,
  GetPetInput,
  UpdatePetInput,
} from '@api/schema/pet.schema';
import logger from '@api/utils/logger';

export default class PetService {
  private readonly petCacheRepository: PetCacheRepository;

  constructor() {
    this.petCacheRepository = new PetCacheRepository();
  }

  async getPets(page?: number, pageSize?: number, sortOrder?: 'asc' | 'desc') {
    if (page && pageSize) {
      const cachedPets = await this.petCacheRepository.getPaginatedPets(
        page,
        pageSize as number,
        sortOrder,
      );

      if (!cachedPets) {
        const pets = await db.pet.findMany();
        await this.petCacheRepository.setPets(pets);
        const updatedCache = await this.petCacheRepository.getPaginatedPets(
          page,
          pageSize as number,
          sortOrder,
        );

        return updatedCache;
      }

      return cachedPets;
    }

    const pets = await this.petCacheRepository.getPets(sortOrder);

    if (!pets) {
      const dbPets = await db.pet.findMany({});
      await this.petCacheRepository.setPets(dbPets);
      return dbPets;
    }

    return pets;
  }

  async getPet(id: GetPetInput['params']['id']) {
    const cachedPet = await this.petCacheRepository.getPet(id);

    if (cachedPet) {
      return cachedPet;
    }

    try {
      const pet = await db.pet.findUniqueOrThrow({
        where: {
          id: id.toString(),
        },
      });
      await this.petCacheRepository.setPet(pet);
      return pet;
    } catch (error) {
      if ((error as { code: string }).code === 'P2025') {
        return null;
      }
    }
    return null;
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
