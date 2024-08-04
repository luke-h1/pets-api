import { Role, User } from '@prisma/client';

export const user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  email: 'testuser@test.com',
  firstName: 'test',
  lastName: 'user',
  password: 'password',
  role: Role.USER,
};
