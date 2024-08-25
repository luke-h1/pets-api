import { db } from '@api/db/prisma';
import { authErrorCodes } from '@api/errors/auth';
import { CreateUserInput } from '@api/schema/auth.schema';
import AuthService from '../auth.service';

describe('AuthService', () => {
  const authService = new AuthService();

  describe('register', () => {
    test('registers new user', async () => {
      const user: CreateUserInput['body'] = {
        email: 'bob@bob.com',
        firstName: 'bob',
        lastName: 'bob',
        password: 'password12345',
      };

      const result = await authService.register(user);

      expect(result).toEqual({
        id: expect.any(String),
        email: expect.any(String),
      });
    });

    test(`returns ${authErrorCodes.EmailAlreadyExists} exception if user exists`, async () => {
      const user: CreateUserInput['body'] = {
        email: 'bob@bob.com',
        firstName: 'bob',
        lastName: 'bob',
        password: 'password12345',
      };
      await db.user.create({
        data: {
          ...user,
        },
      });
      await authService.register(user);
      const result = await authService.register(user);
      expect(result).toEqual(authErrorCodes.EmailAlreadyExists);
    });
  });

  describe('login', () => {
    test('authenticates existing user', async () => {
      const user: CreateUserInput['body'] = {
        email: 'bob@bob.com',
        firstName: 'bob',
        lastName: 'bob',
        password: 'password12345',
      };
      await authService.register(user);

      const result = await authService.login({
        email: user.email,
        password: user.password,
      });

      expect(result).toEqual({
        email: 'bob@bob.com',
        id: expect.any(String),
      });
    });

    test(`throws ${authErrorCodes.InvalidCredentials} error if bad credentials are supplied`, async () => {
      const user: CreateUserInput['body'] = {
        email: 'bob@bob.com',
        firstName: 'bob',
        lastName: 'bob',
        password: 'password12345',
      };
      await authService.register(user);

      const result = await authService.login({
        email: user.email,
        password: `${user.password}123`,
      });

      expect(result).toEqual(authErrorCodes.InvalidCredentials);
    });

    test(`throws ${authErrorCodes.UserNotFound} if no user is found`, async () => {
      const result = await authService.login({
        email: 'test@test.com',
        password: '123',
      });

      expect(result).toEqual(authErrorCodes.UserNotFound);
    });
  });

  describe('deleteAccount', () => {
    test('deletes account', async () => {
      const user: CreateUserInput['body'] = {
        email: 'bob@bob.com',
        firstName: 'bob',
        lastName: 'bob',
        password: 'password12345',
      };
      await authService.register(user);

      const u = await authService.login({
        email: user.email,
        password: user.password,
      });

      const result = await authService.deleteAccount((u as { id: string }).id);

      expect(result).toEqual(true);
    });
  });
});
