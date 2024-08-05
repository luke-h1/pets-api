import supertest from 'supertest';
import { db } from '../../db/prisma';
import server from '../../server';
import { pets } from '../__mocks__/pet';
import { user } from '../__mocks__/user';

describe('pet', () => {
  const app = server.init();

  test('getPets', async () => {
    const u = await db.user.create({
      data: {
        ...user,
      },
    });
    await db.pet.createMany({
      data: pets.slice(3).map(p => ({
        ...p,
        creatorId: u.id,
      })),
    });

    const { body, statusCode } = await supertest(app).get('/api/pets');

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          age: expect.any(String),
          birthDate: expect.any(String),
          breed: expect.any(String),
          createdAt: expect.any(String),
          creatorId: expect.any(String),
          description: expect.any(String),
          id: expect.any(String),
          name: expect.any(String),
          photoUrl: expect.any(String),
          status: expect.any(String),
          tags: expect.arrayContaining([expect.any(String)]),
          updatedAt: expect.any(String),
        }),
      ]),
    );
    expect(statusCode).toBe(200);
  });

  test('getPet', async () => {
    const u = await db.user.create({
      data: {
        ...user,
      },
    });
    const p = await db.pet.create({
      data: {
        ...pets[0],
        creatorId: u.id,
      },
    });

    const { body, statusCode } = await supertest(app).get(`/api/pets/${p.id}`);

    expect(body).toEqual({
      ...pets[0],
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      creatorId: expect.any(String),
    });
    expect(statusCode).toBe(200);
  });

  // describe('createPet', () => {
  //   test('', () => {});
  // });
});
