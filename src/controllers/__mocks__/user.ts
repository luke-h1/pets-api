import { Role, User } from '@prisma/client';
import { v4 } from 'uuid';

type UserWithoutPrismaKeys = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

const randomEmail = `UNIT_TESTS_${Date.now()}${v4()}@example.com`;

export const user: UserWithoutPrismaKeys = {
  email: randomEmail,
  firstName: 'test',
  lastName: 'user',
  password: 'password',
  role: Role.USER,
};

export const user2: UserWithoutPrismaKeys = {
  email: randomEmail,
  firstName: 'marbles',
  lastName: 'cat',
  password: 'password12345',
  role: Role.USER,
};
