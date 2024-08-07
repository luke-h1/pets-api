import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import { PetStatus } from '@prisma/client';
import { CreatePetInput } from '../../schema/pet.schema';
import { createUser, getCookieFromHeaders, loginUser } from '../util/user';

test.describe('createPet', () => {
  test('creates pet when user is authenticated', async ({ request }) => {
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

    const result = await request.post('/api/pets', {
      data: {
        ...p,
      },
      headers: {
        Cookie: cookie,
      },
    });

    expect(result.status()).toEqual(201);
    const response = await result.json();
    expect(response).toEqual({
      ...p,
      createdAt: expect.any(String),
      creatorId: expect.any(String),
      description: p.description,
      id: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test('returns validation error if not authenticated', async ({ request }) => {
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

    const result = await request.post('/api/pets', {
      data: {
        ...p,
      },
      headers: {},
    });

    expect(result.status()).toEqual(401);
    const response = await result.json();
    expect(response).toEqual({
      code: 'Forbidden',
      errors: [],
      message: 'You are not authorized to perform this action',
      statusCode: 401,
      title: 'Forbidden',
      type: 'Forbidden',
    });
  });
});
