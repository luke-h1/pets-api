import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import { PetStatus } from '@prisma/client';
import { CreatePetInput } from '../../schema/pet.schema';
import { createUser, getCookieFromHeaders, loginUser } from '../util/user';

test.describe('updatePet', () => {
  test('updates pet when exists', async ({ request }) => {
    const { response: createUserResponse, userPassword } =
      await createUser(request);

    const user = await loginUser(
      { email: createUserResponse.email, password: userPassword },
      request,
    );

    const headers = user.headers();
    const cookie = await getCookieFromHeaders(headers);

    const p: CreatePetInput['body'] = {
      name: faker.person.firstName(),
      age: faker.number.int({ min: 1, max: 25 }).toString(),
      breed: faker.animal.cat(),
      birthDate: '2024-08-02',
      description: faker.animal.cat(),
      photoUrl: faker.internet.url(),
      status: PetStatus.AVAILABLE,
      tags: ['pet', 'cat', 'tag'],
    };

    const petResponse = await request.post('/api/pets', {
      data: {
        ...p,
      },
      headers: {
        Cookie: cookie,
      },
    });

    const body = await petResponse.json();

    const result = await request.put(`/api/pets/${body.id}`, {
      headers: {
        Cookie: cookie,
      },
      data: {
        ...p,
        name: 'Mr marbles',
      },
    });

    expect(result.status()).toEqual(200);
    const updatedBody = await result.json();
    expect(updatedBody).toEqual({
      ...p,
      name: 'Mr marbles',
      id: body.id,
      createdAt: body.createdAt,
      updatedAt: expect.any(String),
      creatorId: body.creatorId,
    });
  });

  test('returns 404 when pet doesnt exist', async ({ request }) => {
    const { response: createUserResponse, userPassword } =
      await createUser(request);

    const user = await loginUser(
      { email: createUserResponse.email, password: userPassword },
      request,
    );

    const headers = user.headers();
    const cookie = await getCookieFromHeaders(headers);

    const p: CreatePetInput['body'] = {
      name: faker.person.firstName(),
      age: faker.number.int({ min: 1, max: 25 }).toString(),
      breed: faker.animal.cat(),
      birthDate: '2024-08-02',
      description: faker.animal.cat(),
      photoUrl: faker.internet.url(),
      status: PetStatus.AVAILABLE,
      tags: ['pet', 'cat', 'tag'],
    };

    const result = await request.put('/api/pets/123', {
      headers: {
        Cookie: cookie,
      },
      data: {
        ...p,
        name: 'Mr marbles',
      },
    });

    expect(result.status()).toEqual(404);
    const response = await result.json();
    expect(response).toEqual({
      code: 'PetNotFound',
      message: 'Pet not found. Please check your query and try again',
      statusCode: 404,
      title: 'pet not found',
    });
  });

  test("isPetOwner middleware throws forbidden if trying to update another user's pet", async ({
    request,
  }) => {
    const { response: createUserResponse, userPassword } =
      await createUser(request);

    const user = await loginUser(
      { email: createUserResponse.email, password: userPassword },
      request,
    );

    const headers = user.headers();
    const cookie = await getCookieFromHeaders(headers);

    const p: CreatePetInput['body'] = {
      name: faker.person.firstName(),
      age: faker.number.int({ min: 1, max: 25 }).toString(),
      breed: faker.animal.cat(),
      birthDate: '2024-08-02',
      description: faker.animal.cat(),
      photoUrl: faker.internet.url(),
      status: PetStatus.AVAILABLE,
      tags: ['pet', 'cat', 'tag'],
    };

    const petResponse = await request.post('/api/pets', {
      data: {
        ...p,
      },
      headers: {
        Cookie: cookie,
      },
    });

    const body = await petResponse.json();

    const { response: createUserResponse2, userPassword: userPassword2 } =
      await createUser(request);

    const user2 = await loginUser(
      { email: createUserResponse2.email, password: userPassword2 },
      request,
    );

    const headers2 = user2.headers();
    const cookie2 = await getCookieFromHeaders(headers2);

    const result = await request.put(`/api/pets/${body.id}`, {
      headers: {
        Cookie: cookie2,
      },
      data: {
        ...p,
        name: `Updated by ${createUserResponse2.email} :)`,
      },
    });

    expect(result.status()).toBe(401);
    const responseBody = await result.json();

    expect(responseBody).toEqual({
      code: 'forbidden',
      errors: [],
      message: 'You are not authorized to perform this action',
      statusCode: 401,
      title: 'You are not authorized to perform this action',
      type: 'Forbidden',
    });
  });
});