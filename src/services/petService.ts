import { db } from '../db/prisma';
import {
  CreatePetInput,
  DeletePetInput,
  GetPetInput,
  UpdatePetInput,
} from '../schema/pet.schema';
import logger from '../utils/logger';

export default class PetService {
  async getPets() {
    const pets = await db.pet.findMany();
    return pets;
  }

  async getPet(id: GetPetInput['params']['id']) {
    const pet = await db.pet.findFirst({
      where: {
        id: id.toString(),
      },
    });

    return pet;
  }

  async createPet(pet: CreatePetInput['body'], userId: string) {
    const newPet = await db.pet.create({
      data: {
        ...pet,
        creatorId: userId,
      },
    });
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

    return updatedPet;
  }

  async deletePet(id: DeletePetInput['params']['id']) {
    const result = await db.pet.delete({ where: { id: id.toString() } });

    logger.info('delete result', result);
    return null;
  }
}
