import supertest from 'supertest';
import { db } from '../../db/prisma';
import server from '../../server';
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
      expect(body).toHaveLength(6);
    });
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
      '/api/pets?page=1&pageSize=2',
    );
    expect(body).toHaveLength(2);
    expect(statusCode).toBe(200);

    const { body: secondPageBody, statusCode: secondPageStatusCode } =
      await supertest(app).get('/api/pets?page=2&pageSize=3');
    expect(secondPageBody).toHaveLength(0);
    expect(secondPageStatusCode).toBe(200);
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
    test('unautheticated user cannot delete pet', async () => {
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

      const { body, statusCode: deleteStatusCode } = await supertest(app)
        .delete(`/api/pets/${createdPet.id}`)
        .set('Cookie', `${cookieName}=${cookieValue}`);

      expect(deleteStatusCode).toBe(200);
      expect(body).toEqual('');
    });
  });
});
