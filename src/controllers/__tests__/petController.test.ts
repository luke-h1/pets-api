import supertest from 'supertest';
import { db } from '../../db/prisma';
import server from '../../server';
import { pets } from '../__mocks__/pet';
import { user as mockUser } from '../__mocks__/user';

describe('pet', () => {
  const app = server.init();

  beforeAll(async () => {});

  describe('getPets', () => {
    test('returns pets', async () => {
      const user = await db.user.create({
        data: { ...mockUser },
      });

      await db.pet.createMany({
        data: pets.map(p => ({ ...p, creatorId: user.id })),
      });

      const { body, statusCode } = await supertest(app).get('/api/pets');

      expect(statusCode).toBe(200);
      expect(body).toEqual(
        expect.arrayContaining([
          {
            birthDate: expect.any(String),
            breed: expect.any(String),
            createdAt: expect.any(String),
            creatorId: expect.any(String),
            id: expect.any(String),
            name: expect.any(String),
            photoUrl: expect.any(String),
            status: expect.any(String),
            type: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
      );
    });

    test('returns 200 and empty array if not pets found', async () => {
      const { body, statusCode } = await supertest(app).get('/api/pets');
      expect(statusCode).toBe(200);
      expect(body).toEqual([]);
    });
  });
});
