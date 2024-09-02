import { LoginRequest, RegisterRequest } from '@api/requests/auth.requests';
import { faker } from '@faker-js/faker';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { User } from '@prisma/client';
import { Dictionary } from '../../types/util';

export const createUser = async (
  request: APIRequestContext,
): Promise<{
  response: Omit<User, 'password'>;
  userPassword: string;
}> => {
  // arrange

  const u: RegisterRequest['body'] = {
    firstName: `E2E_USER_${faker.person.firstName()}`,
    lastName: `E2E_USER_${faker.person.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const created = await request.post('/api/auth/register', {
    data: {
      ...u,
    },
  });
  expect(created.status()).toEqual(201);
  const response = await created.json();

  return {
    response,
    userPassword: u.password,
  };
};

export const loginUser = async (
  { email, password }: LoginRequest['body'],
  request: APIRequestContext,
): Promise<APIResponse> => {
  const result = await request.post('/api/auth/login', {
    data: {
      email,
      password,
    },
  });

  expect(result.status()).toBe(200);
  return result;
};

export const getCookieFromHeaders = async (headers: Dictionary<string>) => {
  // due to the presence of other set-cookie headers from cf, aws ALB, etc
  // we need different logic for local vs deployed

  // only works for fly.io - see other commits for working with AWS ECS
  if (process.env.API_BASE_URL !== 'http://localhost:8000') {
    const cookieValue = headers['set-cookie'][0]
      .split(';')[0]
      .split('=')[1] as string;

    return cookieValue as string;
  }

  return headers['set-cookie'][0].split(';')[0].split('=')[1] as string;
};
