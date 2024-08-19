import { PetStatus } from '@prisma/client';
import { pets as mockPets } from '../../controllers/__mocks__/pet';
import { user } from '../../controllers/__mocks__/user';
import { db } from '../../db/prisma';
import { CreatePetInput } from '../../schema/pet.schema';
import PetService from '../pet.service';

describe('petService', () => {
  let petService: PetService;

  beforeAll(() => {
    petService = new PetService();
  });

  describe('getPets', () => {
    test('returns pets from the database', async () => {
      const u = await db.user.create({
        data: user,
      });

      await db.pet.createMany({
        data: mockPets.map(pet => ({
          ...pet,
          creatorId: u.id,
        })),
      });
      const pets = await petService.getPets();
      expect(pets).toEqual([
        ...mockPets.map(pet => ({
          ...pet,
          creatorId: u.id,
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })),
      ]);
    });
  });

  describe('getPet', () => {
    test('returns a pet from the database', async () => {
      const u = await db.user.create({
        data: user,
      });

      await db.pet.createMany({
        data: mockPets.map(pet => ({
          ...pet,
          creatorId: u.id,
        })),
      });

      const pets = await db.pet.findMany();

      const pet = await petService.getPet(pets[0].id);
      expect(pet).toEqual({
        ...mockPets[0],
        creatorId: u.id,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('createPet', () => {
    test('can create a pet', async () => {
      const u = await db.user.create({
        data: user,
      });

      const pet: CreatePetInput['body'] = {
        name: 'marbles',
        description: 'marbles is a good cat',
        age: '2',
        birthDate: '2022-02-02',
        breed: 'cat :)',
        images: [
          'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/1723990567355-GTgYHDgWsAAX4HO.png',
        ],
        status: PetStatus.AVAILABLE,
        tags: ['cute', 'indoor'],
      };

      const result = await petService.createPet(pet, u.id);

      expect(result).toEqual({
        ...pet,
        creatorId: u.id,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updatePet', () => {
    test('update a pet', async () => {
      const u = await db.user.create({
        data: user,
      });

      const createdPet: CreatePetInput['body'] = {
        name: 'marbles',
        description: 'marbles is a good cat',
        age: '2',
        birthDate: '2022-02-02',
        breed: 'cat :)',
        images: [
          'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/1723990567355-GTgYHDgWsAAX4HO.png',
        ],
        status: PetStatus.AVAILABLE,
        tags: ['cute', 'indoor'],
      };

      const createdResult = await petService.createPet(createdPet, u.id);

      const result = await petService.updatePet(createdResult.id, {
        ...createdPet,
        name: 'Updated Pet',
      });

      expect(result).toEqual({
        ...createdPet,
        name: 'Updated Pet',
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        creatorId: u.id,
      });
    });
  });

  describe('deletePet', () => {
    test('delete pet', async () => {
      const u = await db.user.create({
        data: user,
      });

      const createdPet: CreatePetInput['body'] = {
        name: 'marbles',
        description: 'marbles is a good cat',
        age: '2',
        birthDate: '2022-02-02',
        breed: 'cat :)',
        images: [
          'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/1723990567355-GTgYHDgWsAAX4HO.png',
        ],
        status: PetStatus.AVAILABLE,
        tags: ['cute', 'indoor'],
      };

      const createdResult = await petService.createPet(createdPet, u.id);

      const result = await petService.deletePet(createdResult.id);
      expect(result).toEqual(null);
    });
  });
});
