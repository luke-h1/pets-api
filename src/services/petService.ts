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
    const pets = await orm.getRepository(Pet).find({});

    return pets;
  }

  async getPet(id: GetPetInput['params']['id']) {
    const orm = await this.db.getInstance();
    const pet = await orm.getRepository(Pet).findOne({
      where: {
        id: id.toString(),
      },
    });

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
    const result = await orm.getRepository(Pet).delete(id);

    logger.info('delete result', result);
    return null;
  }
}
