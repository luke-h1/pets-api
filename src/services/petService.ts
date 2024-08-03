import Database from '../db/database';
import { Pet } from '../entities/Pet';
import {
  CreatePetInput,
  DeletePetInput,
  GetPetInput,
  UpdatePetInput,
} from '../schema/pet.schema';
import logger from '../utils/logger';

export default class PetService {
  private readonly db: typeof Database;

  constructor() {
    this.db = Database;
  }

  async getPets() {
    const orm = await this.db.getInstance();

    const pets = await orm.em.getRepository(Pet).findAll({
      populate: ['creator', 'tags'],
    });

    return pets;
  }

  async getPet(id: GetPetInput['params']['id']) {
    const orm = await this.db.getInstance();
    const pet = await orm.em.getRepository(Pet).findOne(
      {
        id: id.toString(),
      },
      {
        populate: ['creator', 'tags'],
      },
    );

    return pet;
  }

  async createPet(pet: CreatePetInput['body']) {}

  async updatePet(
    id: UpdatePetInput['params']['id'],
    pet: UpdatePetInput['body'],
  ) {
    return null;
  }

  async deletePet(id: DeletePetInput['params']['id']) {
    const orm = await this.db.getInstance();

    const result = await orm.em.getRepository(Pet).nativeDelete({
      id: id.toString(),
    });

    logger.info('delete result', result);
    return null;
  }
}
