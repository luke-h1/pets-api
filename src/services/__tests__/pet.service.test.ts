import { pets as mockPets } from '@api/controllers/__mocks__/pet';
import { user } from '@api/controllers/__mocks__/user';
import { db } from '@api/db/prisma';
import { CreatePetInput } from '@api/schema/pet.schema';
import { PetStatus } from '@prisma/client';
import PetService from '../pet.service';

describe('petService', () => {
  let petService: PetService;

  beforeAll(() => {
    petService = new PetService();
  });

  describe('getPets', () => {
    test('returns pets', async () => {
      const u = await db.user.create({
        data: user,
      });

      await db.pet.createMany({
        data: mockPets.map(pet => ({
          ...pet,
          creatorId: u.id,
        })),
      });

      const { pets } = await petService.getPets(1, 10000, 'asc');
      expect(pets).toEqual([
        {
          age: '12',
          birthDate: '2022',
          breed: 'Golden Retriever',
          createdAt: expect.any(String),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: [
            'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/GTgYHDgWsAAX4HO.png',
          ],
          name: 'Buddy',
          status: 'AVAILABLE',
          tags: ['dog'],
          updatedAt: expect.any(String),
        },
        {
          age: '12',
          birthDate: '2022',
          breed: 'Siamese',
          createdAt: expect.any(String),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: [
            'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/GTgYHDgWsAAX4HO.png',
          ],
          name: 'Mittens',
          status: 'ADOPTED',
          tags: ['dog'],
          updatedAt: expect.any(String),
        },
        {
          age: '12',
          birthDate: '2022',
          breed: 'Labrador Retriever',
          createdAt: expect.any(String),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: [
            'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/GTgYHDgWsAAX4HO.png',
          ],
          name: 'Charlie',
          status: 'AVAILABLE',
          tags: ['dog'],
          updatedAt: expect.any(String),
        },
        {
          age: '12',
          birthDate: '2022',
          breed: 'Maine Coon',
          createdAt: expect.any(String),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: [
            'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/GTgYHDgWsAAX4HO.png',
          ],
          name: 'Whiskers',
          status: 'PENDING',
          tags: ['dog'],
          updatedAt: expect.any(String),
        },
        {
          age: '12',
          birthDate: '2022',
          breed: 'Beagle',
          createdAt: expect.any(String),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: [
            'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/GTgYHDgWsAAX4HO.png',
          ],
          name: 'Max',
          status: 'ADOPTED',
          tags: ['dog'],
          updatedAt: expect.any(String),
        },
        {
          age: '12',
          birthDate: '2022',
          breed: 'Bengal',
          createdAt: expect.any(String),
          creatorId: u.id,
          description: 'dog',
          id: expect.any(String),
          images: [
            'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/GTgYHDgWsAAX4HO.png',
          ],
          name: 'Luna',
          status: 'AVAILABLE',
          tags: ['dog'],
          updatedAt: expect.any(String),
        },
      ]);
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
