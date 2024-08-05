import { db } from '../db/prisma';
import RedisDatabase from '../db/redis';
import {
  CreatePetInput,
  DeletePetInput,
  GetPetInput,
  UpdatePetInput,
} from '../schema/pet.schema';
import logger from '../utils/logger';

export default class PetService {
  private readonly redis: typeof RedisDatabase;

  constructor() {
    this.redis = RedisDatabase;
  }

  async getPets() {
    // const cachedPets = await this.redis.getAll<Pet[]>('pets');

    // if (cachedPets && cachedPets.length) {
    //   return JSON.parse(cachedPets as unknown as string);
    // }

    const pets = await db.pet.findMany();

    // save to cache
    // console.log('pets', JSON.stringify(pets, null, 2));
    // await this.redis.set('pets', JSON.stringify(pets));

    return pets;
  }

  async getPet(id: GetPetInput['params']['id']) {
    // const cachedPet = await this.redis.get<Pet>(`pet:${id}`);
    // if (cachedPet) {
    //   return JSON.parse(cachedPet as unknown as string);
    // }

    const pet = await db.pet.findFirst({
      where: {
        id: id.toString(),
      },
    });

    // await this.redis.set(`pet:${id}`, JSON.stringify(pet));

    // console.log('key is', `pet:${id}`);

    return pet;
  }

  async createPet(pet: CreatePetInput['body'], userId: string) {
    const newPet = await db.pet.create({
      data: {
        ...pet,
        creatorId: userId,
      },
    });

    // await this.redis.set(`pet:${newPet.id}`, JSON.stringify(newPet));

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

    // await this.redis.set(`pet:${id}`, JSON.stringify(updatedPet));
    return updatedPet;
  }

  async deletePet(id: DeletePetInput['params']['id']) {
    const result = await db.pet.delete({ where: { id: id.toString() } });

    // await this.redis.deleteItem(`pet:${id}`);

    logger.info('delete result', result);
    return null;
  }
}
