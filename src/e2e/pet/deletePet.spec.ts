import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import { PetStatus } from '@prisma/client';
import { CreatePetInput } from 'src/schema/pet.schema';
import { createUser, loginUser, getCookieFromHeaders } from '../util/user';

test.describe('deletePet', () => {
  test('deletes pet when authenticated', async ({ request }) => {
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

    const result = await request.delete(`/api/pets/${body.id}`, {
      headers: {
        Cookie: cookie,
      },
    });

    expect(result.status()).toEqual(200);

    const notFoundPet = await request.get(`/api/pets/${body.id}`);

    expect(notFoundPet.status()).toEqual(404);
    const notFoundBody = await notFoundPet.json();
    expect(notFoundBody).toEqual({
      code: 'PetNotFound',
      errors: [],
      message: 'Pet not found',
      statusCode: 404,
      title: 'Pet not found',
      type: 'Not Found',
    });
  });
});
