import { LoginRequest, RegisterRequest } from '@api/requests/auth.requests';
import { faker } from '@faker-js/faker';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { User } from '@prisma/client';
import crypto from 'crypto';
import { v4 } from 'uuid';
import { Dictionary } from '../../types/util';

export const createUser = async (
  request: APIRequestContext,
): Promise<{
  response: Omit<User, 'password'>;
  userPassword: string;
}> => {
  // arrange

  const randomPassword = crypto.randomBytes(20).toString('hex');

  const u: RegisterRequest['body'] = {
    firstName: `TEST_USER-${faker.person.firstName()}`,
    lastName: `TEST_USER-${faker.person.lastName()}`,
    email: `TEST_USER-${v4()}em@email.com`,
    password: randomPassword,
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

  if (process.env.API_BASE_URL !== 'http://localhost:8000') {
    const setCookieHeader = headers['set-cookie'];
    const accessToken = setCookieHeader
      .split(',')
      .find(c => c.includes('PETS_V1_id'));
    const cookieValue = accessToken?.split(';')[0].split('=')[1];
    return cookieValue as string;
  }

  const result = headers['set-cookie'].split(';')[0].split('=')[1] as string;
  return `PETS_V1_id=${result}`;
};
