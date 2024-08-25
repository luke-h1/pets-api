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
    if (page) {
      const cachedPets = await this.petCacheRepository.getPaginatedPets(
        page,
        pageSize,
        sortOrder,
      );

      if (!cachedPets) {
        const pets = await db.pet.findMany();
        await this.petCacheRepository.setPets(pets);
        const updatedCache = await this.petCacheRepository.getPaginatedPets(
          page,
          pageSize,
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
      return this.petCacheRepository.getPets();
    }

    return pets;
  }

  async getPet(id: GetPetInput['params']['id']) {
    const cachedPet = await this.petCacheRepository.getPet(id);

    if (cachedPet) {
      return cachedPet;
    }

    const pet = await db.pet.findFirst({
      where: {
        id: id.toString(),
      },
    });

    if (!pet) {
      return null;
    }

    await this.petCacheRepository.setPet(pet);

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
    await this.petCacheRepository.deletePets();
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

    await this.petCacheRepository.setPet(updatedPet);
    await this.petCacheRepository.deletePets();
    return updatedPet;
  }

  async deletePet(id: DeletePetInput['params']['id']) {
    try {
      await Promise.allSettled([
        db.pet.delete({ where: { id: id.toString() } }),
        this.petCacheRepository.deletePet(id),
        this.petCacheRepository.deletePets(),
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
