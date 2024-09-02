import { db } from '@api/db/prisma';
import { sleep } from '@api/e2e/util/sleep';
import server from '@api/server';
import { testImages } from '@api/test/testImages';
import { expect } from '@playwright/test';
import supertest from 'supertest';
import { pets } from '../__mocks__/pet';
import { user, user2 } from '../__mocks__/user';

describe('pet', () => {
  const app = server.init();

  describe('getPets', () => {
    test('getPets', async () => {
      const u = await db.user.create({
        data: user,
      });

      await db.pet.createMany({
        data: pets.map(p => ({
          ...p,
          creatorId: u.id,
        })),
      });

      const { body, statusCode } = await supertest(app).get('/api/pets');
      expect(statusCode).toBe(200);
      expect(body.pets).toHaveLength(6);
    });

    test('getPets with pagination', async () => {
      const u = await db.user.create({
        data: user,
      });
      await db.pet.createMany({
        data: pets.slice(3).map(p => ({
          ...p,
          creatorId: u.id,
        })),
      });

      const { body, statusCode } = await supertest(app).get(
        '/api/pets?page=1&pageSize=1',
      );
      expect(statusCode).toEqual(200);
      expect(body).toEqual({
        _links: {
          self: {
            href: expect.stringMatching(
              /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/pets\?page=1&pageSize=1$/,
            ),
          },
        },
        paging: {
          page: 1,
          query: { page: '1', pageSize: '1' },
          totalPages: 1,
          totalResults: 1,
        },
        pets: [
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
        ],
      });

      const { body: secondPageBody, statusCode: secondPageStatusCode } =
        await supertest(app).get('/api/pets?page=2&pageSize=1');

      expect(secondPageStatusCode).toEqual(200);

      expect(secondPageBody).toEqual({
        _links: {
          prev: {
            href: expect.stringMatching(
              /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/pets\?page=1&pageSize=1$/,
            ),
          },
          self: {
            href: expect.stringMatching(
              /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/pets\?page=2&pageSize=1$/,
            ),
          },
        },
        paging: {
          page: 2,
          query: { page: '2', pageSize: '1' },
          totalPages: 1,
          totalResults: 1,
        },
        pets: [
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
        ],
      });

      const { body: thirdPageBody, statusCode: thirdPageStatusCode } =
        await supertest(app).get('/api/pets?page=3&pageSize=1');

      expect(thirdPageStatusCode).toEqual(200);
      expect(thirdPageBody).toEqual({
        _links: {
          prev: {
            href: expect.stringMatching(
              /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/pets\?page=2&pageSize=1$/,
            ),
          },
          self: {
            href: expect.stringMatching(
              /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/pets\?page=3&pageSize=1$/,
            ),
          },
        },
        paging: {
          page: 3,
          query: { page: '3', pageSize: '1' },
          totalPages: 1,
          totalResults: 1,
        },
        pets: [
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
        ],
      });

      const { body: fourthPage, statusCode: fourthPageStatusCode } =
        await supertest(app).get('/api/pets?page=4&pageSize=1');

      expect(fourthPageStatusCode).toEqual(200);

      expect(fourthPage).toEqual({
        _links: {
          prev: {
            href: expect.stringMatching(
              /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/pets\?page=3&pageSize=1$/,
            ),
          },
          self: {
            href: expect.stringMatching(
              /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/pets\?page=4&pageSize=1$/,
            ),
          },
        },
        paging: {
          page: 4,
          query: { page: '4', pageSize: '1' },
          totalPages: 0,
          totalResults: 0,
        },
        pets: [],
      });
    });

    test('sortOrder asc', async () => {
      const u = await db.user.create({
        data: user,
      });
      await db.pet.createMany({
        data: [
          {
            name: 'bob',
            age: '12',
            birthDate: '2022',
            breed: 'cat',
            description: 'cat',
            images: testImages,
            status: 'PENDING',
            createdAt: new Date('2022-01-01'),
            creatorId: u.id,
          },
          {
            name: 'Tiffany',
            age: '15',
            birthDate: '2022',
            breed: 'dog',
            description: 'dog',
            images: testImages,
            status: 'ADOPTED',
            createdAt: new Date('2024-01-01'),
            creatorId: u.id,
          },
        ],
      });

      const { body, statusCode } = await supertest(app).get(
        '/api/pets?page=1&pageSize=2&order=asc',
      );

      expect(statusCode).toBe(200);
      expect(body).toEqual({
        _links: {
          self: {
            href: expect.any(String),
          },
        },
        paging: {
          page: 1,
          query: { order: 'asc', page: '1', pageSize: '2' },
          totalPages: 1,
          totalResults: 2,
        },
        pets: [
          {
            age: '12',
            birthDate: '2022',
            breed: 'cat',
            createdAt: '2022-01-01T00:00:00.000Z',
            creatorId: u.id,
            description: 'cat',
            id: expect.any(String),
            images: testImages,
            name: 'bob',
            status: 'PENDING',
            tags: [],
            updatedAt: expect.any(String),
          },
          {
            age: '15',
            birthDate: '2022',
            breed: 'dog',
            createdAt: '2024-01-01T00:00:00.000Z',
            creatorId: u.id,
            description: 'dog',
            id: expect.any(String),
            images: testImages,
            name: 'Tiffany',
            status: 'ADOPTED',
            tags: [],
            updatedAt: expect.any(String),
          },
        ],
      });
    });
    test('sortOrder desc', async () => {
      const u = await db.user.create({
        data: user,
      });
      await db.pet.createMany({
        data: [
          {
            name: 'bob',
            age: '12',
            birthDate: '2022',
            breed: 'cat',
            description: 'cat',
            images: testImages,
            status: 'PENDING',
            createdAt: new Date('2022-01-01'),
            creatorId: u.id,
          },
          {
            name: 'Tiffany',
            age: '15',
            birthDate: '2022',
            breed: 'dog',
            description: 'dog',
            images: testImages,
            status: 'ADOPTED',
            createdAt: new Date('2024-01-01'),
            creatorId: u.id,
          },
        ],
      });

      const { body, statusCode } = await supertest(app).get(
        '/api/pets?page=1&pageSize=2&order=desc',
      );

      expect(statusCode).toBe(200);
      expect(body).toEqual({
        _links: {
          self: {
            href: expect.any(String),
          },
        },
        paging: {
          page: 1,
          query: { order: 'desc', page: '1', pageSize: '2' },
          totalPages: 1,
          totalResults: 2,
        },
        pets: [
          {
            age: '15',
            birthDate: '2022',
            breed: 'dog',
            createdAt: '2024-01-01T00:00:00.000Z',
            creatorId: u.id,
            description: 'dog',
            id: expect.any(String),
            images: testImages,
            name: 'Tiffany',
            status: 'ADOPTED',
            tags: [],
            updatedAt: expect.any(String),
          },
          {
            age: '12',
            birthDate: '2022',
            breed: 'cat',
            createdAt: '2022-01-01T00:00:00.000Z',
            creatorId: u.id,
            description: 'cat',
            id: expect.any(String),
            images: testImages,
            name: 'bob',
            status: 'PENDING',
            tags: [],
            updatedAt: expect.any(String),
          },
        ],
      });
    });
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

  describe('createPet', () => {
    test('unauthenticated user cannot create pet', async () => {
      const userCookie = '';

      const { statusCode, body } = await supertest(app)
        .post('/api/pets')
        .set('Cookie', userCookie)
        .send(pets[0]);

      expect(statusCode).toEqual(401);

      expect(body).toEqual({
        code: 'Forbidden',
        errors: [],
        message: 'You are not authorized to perform this action',
        statusCode: 401,
        title: 'Forbidden',
        type: 'Forbidden',
      });
    });

    test('authenticated user can create pet', async () => {
      await supertest(app).post('/api/auth/register').send(user);

      const { headers, statusCode } = await supertest(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(statusCode).toBe(200);

      const cookieValue = headers['set-cookie'][0].split(';')[0].split('=')[1];
      const cookieName = 'connect.sid';

      const { body, statusCode: petStatusCode } = await supertest(app)
        .post('/api/pets')
        .set('Cookie', `${cookieName}=${cookieValue}`)
        .send(pets[0]);

      expect(petStatusCode).toBe(201);
      expect(body).toEqual({
        ...pets[0],
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creatorId: expect.any(String),
      });
    });
  });

  describe('updatePet', () => {
    test('authenticated user can update their pet', async () => {
      await supertest(app).post('/api/auth/register').send(user);

      const { headers, statusCode } = await supertest(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(statusCode).toBe(200);

      const cookieValue = headers['set-cookie'][0].split(';')[0].split('=')[1];
      const cookieName = 'connect.sid';

      const { body: createdPet } = await supertest(app)
        .post('/api/pets')
        .set('Cookie', `${cookieName}=${cookieValue}`)
        .send(pets[0]);

      const { statusCode: updatedPetStatusCode, body: updatedPetBody } =
        await supertest(app)
          .put(`/api/pets/${createdPet.id}`)
          .set('Cookie', `${cookieName}=${cookieValue}`)
          .send({
            ...pets[0],
            name: 'Marbles',
          });

      expect(updatedPetStatusCode).toBe(200);
      expect(updatedPetBody).toEqual({
        ...pets[0],
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creatorId: createdPet.creatorId,
        name: 'Marbles',
      });
    });

    test("authenticated user cannot update another user's pet", async () => {
      // user 1
      await supertest(app).post('/api/auth/register').send(user);

      const { headers, statusCode } = await supertest(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(statusCode).toBe(200);

      const cookieValue = headers['set-cookie'][0].split(';')[0].split('=')[1];
      const cookieName = 'connect.sid';

      // create a pet authenticated as user1
      const { body: createdPet } = await supertest(app)
        .post('/api/pets')
        .set('Cookie', `${cookieName}=${cookieValue}`)
        .send(pets[0]);

      // user 2
      await supertest(app).post('/api/auth/register').send(user2);

      const { headers: headers2, statusCode: statusCode2 } = await supertest(
        app,
      )
        .post('/api/auth/login')
        .send({
          email: user2.email,
          password: user2.password,
        });
      expect(statusCode2).toBe(200);

      const cookieValue2 = headers2['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];

      const { statusCode: updatedStatusCode, body: updatedBody } =
        await supertest(app)
          .put(`/api/pets/${createdPet.id}`)
          .set('Cookie', `${cookieName}=${cookieValue2}`)
          .send({
            ...pets[0],
            name: `Updated by ${user2.firstName}`,
          });

      expect(updatedStatusCode).toBe(401);
      expect(updatedBody).toEqual({
        code: 'forbidden',
        errors: [],
        message: 'You are not authorized to perform this action',
        statusCode: 401,
        title: 'You are not authorized to perform this action',
        type: 'Forbidden',
      });
    });
  });

  describe('deletePet', () => {
    test('unauthenticated user cannot delete pet', async () => {
      await supertest(app).post('/api/auth/register').send(user);

      const { headers, statusCode } = await supertest(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(statusCode).toBe(200);

      const cookieValue = headers['set-cookie'][0].split(';')[0].split('=')[1];
      const cookieName = 'connect.sid';

      // create a pet authenticated as user1
      const { body: createdPet } = await supertest(app)
        .post('/api/pets')
        .set('Cookie', `${cookieName}=${cookieValue}`)
        .send(pets[0]);

      const { body, statusCode: deleteStatusCode } = await supertest(
        app,
      ).delete(`/api/pets/${createdPet.id}`);

      expect(deleteStatusCode).toBe(401);

      expect(body).toEqual({
        code: 'Forbidden',
        errors: [],
        message: 'You are not authorized to perform this action',
        statusCode: 401,
        title: 'Forbidden',
        type: 'Forbidden',
      });
    });

    test('authenticated user can delete their own pet', async () => {
      await supertest(app).post('/api/auth/register').send(user);

      const { headers, statusCode } = await supertest(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(statusCode).toBe(200);

      const cookieValue = headers['set-cookie'][0].split(';')[0].split('=')[1];
      const cookieName = 'connect.sid';

      // create a pet authenticated as user1
      const { body: createdPet } = await supertest(app)
        .post('/api/pets')
        .set('Cookie', `${cookieName}=${cookieValue}`)
        .send(pets[0]);

      await sleep(1000);

      const { body, statusCode: deleteStatusCode } = await supertest(app)
        .delete(`/api/pets/${createdPet.id}`)
        .set('Cookie', `${cookieName}=${cookieValue}`);

      expect(deleteStatusCode).toBe(200);
      expect(body).toEqual({});
    });
  });
});
