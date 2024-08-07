import { test, expect } from '@playwright/test';
import { createUser } from '../util/user';

test.describe('login', () => {
  test('authenticates existing user', async ({ request }) => {
    // arrange
    const { response: createUserResponse, userPassword } =
      await createUser(request);

    // act
    const result = await request.post('/api/auth/login', {
      data: {
        email: createUserResponse.email,
        password: userPassword,
      },
    });

    // assert
    expect(result.status()).toEqual(200);
    const response = await result.json();
    expect(response).toEqual({
      email: createUserResponse.email,
      id: expect.any(String),
    });

    expect(result.headers()).toEqual({
      'access-control-allow-origin': '*',
      connection: 'keep-alive',
      'content-length': expect.any(String),
      'content-type': 'application/json; charset=utf-8',
      date: expect.any(String),
      etag: expect.any(String),
      'keep-alive': expect.any(String),
      'set-cookie': expect.stringContaining('connect.sid='),
      vary: expect.any(String),
    });
  });

  test('returns validation error when password is incorrect', async ({
    request,
  }) => {
    const { response: createUserResponse } = await createUser(request);

    // act
    const login = await request.post('/api/auth/login', {
      data: {
        email: createUserResponse.email,
        password: '123456789',
      },
    });

    expect(login.status()).toEqual(400);
    const response = await login.json();
    expect(response).toEqual({
      code: 'InvalidCredentials',
      errors: [
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Invalid email or password',
          path: ['body', 'email'],
          received: 'undefined',
        },
      ],
      message: 'Invalid credentials',
      statusCode: 400,
      title: 'Bad credentials supplied',
      type: 'Bad request',
    });

    expect(login.headers()).toEqual({
      'access-control-allow-origin': '*',
      connection: 'keep-alive',
      'content-length': expect.any(String),
      'content-type': 'application/json; charset=utf-8',
      date: expect.any(String),
      etag: expect.any(String),
      'keep-alive': expect.any(String),
      vary: expect.any(String),
    });
  });

  test('throws not found if no user is found', async ({ request }) => {
    const result = await request.post('/api/auth/login', {
      data: {
        email: 'e@e.com',
        password: '123456789s',
      },
    });
    expect(result.status()).toEqual(404);
    const response = await result.json();
    expect(response).toEqual({
      code: 'UserNotFound',
      errors: [
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'User not found',
          path: ['body', 'email'],
          received: 'undefined',
        },
      ],
      message: 'User not found',
      statusCode: 404,
      title: 'User not found',
      type: 'Not Found',
    });
  });
});
