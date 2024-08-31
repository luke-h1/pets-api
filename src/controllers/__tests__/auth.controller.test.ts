import { db } from '@api/db/prisma';
import { LoginRequest, RegisterRequest } from '@api/requests/auth.requests';
import server from '@api/server';
import supertest from 'supertest';
import { v4 } from 'uuid';

describe('auth', () => {
  const app = server.init();

  describe('register', () => {
    test('registers user', async () => {
      const user: RegisterRequest['body'] = {
        email: 'bob@email.com',
        firstName: 'test',
        lastName: 'test',
        password: 'password',
      };

      const { body, statusCode } = await supertest(app)
        .post('/api/auth/register')
        .send(user);

      expect(statusCode).toBe(201);

      expect(body).toEqual({
        id: expect.any(String),
        email: expect.any(String),
      });
    });

    test('returns bad request when user exists', async () => {
      const user: RegisterRequest['body'] = {
        email: 'bob@email.com',
        firstName: 'test',
        lastName: 'test',
        password: 'password',
      };

      await db.user.create({
        data: user,
      });

      const { body, statusCode } = await supertest(app)
        .post('/api/auth/register')
        .send(user);

      expect(statusCode).toBe(400);

      expect(body).toEqual({
        code: 'EmailAlreadyExists',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['body', 'email'],
            message: 'Email already exists',
          },
        ],
        message: 'Email already exists',
        statusCode: 400,
        title: 'Email already exists',
        type: 'Bad request',
      });
    });
  });

  describe('login', () => {
    test('authenticates existing user', async () => {
      const user: RegisterRequest['body'] = {
        email: 'bob@email.com',
        firstName: 'test',
        lastName: 'test',
        password: 'password',
      };
      await supertest(app).post('/api/auth/register').send(user);

      const u: LoginRequest['body'] = {
        email: user.email,
        password: user.password,
      };

      const { body, statusCode, headers } = await supertest(app)
        .post('/api/auth/login')
        .send(u);

      expect(statusCode).toBe(200);
      expect(body).toEqual({ id: expect.any(String), email: 'bob@email.com' });

      expect(headers).toEqual({
        'access-control-allow-origin': '*',
        connection: expect.any(String),
        'content-length': expect.any(String),
        'content-type': expect.any(String),
        date: expect.any(String),
        etag: expect.any(String),
        'set-cookie': expect.arrayContaining([
          expect.stringMatching(/^PETS_V1_id=/),
        ]),
        vary: 'Accept-Encoding',
      });
    });

    test('throws not found if no user is found', async () => {
      const user: LoginRequest['body'] = {
        email: `${v4()}@email.com`,
        password: v4(),
      };

      const { body, statusCode } = await supertest(app)
        .post('/api/auth/login')
        .send(user);

      expect(body).toEqual({
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
      expect(statusCode).toEqual(404);
    });

    test('throws 400 when invalid password is supplied', async () => {
      const user: RegisterRequest['body'] = {
        email: 'bob@email.com',
        firstName: 'test',
        lastName: 'test',
        password: 'password',
      };
      await supertest(app).post('/api/auth/register').send(user);

      const { body, statusCode } = await supertest(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: `${user.password}-123`,
        });

      expect(statusCode).toBe(400);
      expect(body).toEqual({
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
    });
  });

  describe('logout', () => {
    test('destroys session and cookie', async () => {
      const user: RegisterRequest['body'] = {
        email: 'bob@email.com',
        firstName: 'test',
        lastName: 'test',
        password: 'password',
      };
      await supertest(app).post('/api/auth/register').send(user);
      await supertest(app).post('/api/auth/login').send({
        email: user.email,
        password: user.password,
      });

      const { statusCode, headers } =
        await supertest(app).post('/api/auth/logout');

      expect(statusCode).toBe(200);

      expect(headers).not.toEqual({
        'set-cookie': expect.arrayContaining([
          expect.stringMatching(/^PETS_V1_id=/),
        ]),
      });

      const authResult = await supertest(app).get('/api/auth');
      expect(authResult.body).toEqual({ isAuth: false });
      expect(authResult.status).toBe(200);
    });
  });

  describe('isAuth', () => {
    test('returns true if user is authenticated', async () => {
      const user: RegisterRequest['body'] = {
        email: 'bob@email.com',
        firstName: 'test',
        lastName: 'test',
        password: 'password',
      };
      await supertest(app).post('/api/auth/register').send(user);
      const { headers } = await supertest(app).post('/api/auth/login').send({
        email: user.email,
        password: user.password,
      });

      const cookieValue = headers['set-cookie'][0].split(';')[0].split('=')[1];
      const cookieName = 'PETS_V1_id';

      const { body } = await supertest(app)
        .get('/api/auth')
        .set('Cookie', `${cookieName}=${cookieValue}`);

      expect(body).toEqual({ isAuth: true });
    });

    test('returns false if user is unauthenticated', async () => {
      const { body } = await supertest(app).get('/api/auth');

      expect(body).toEqual({ isAuth: false });
    });
  });
});
