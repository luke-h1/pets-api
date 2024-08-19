import './setEnvVars';
import { config } from 'dotenv';
import { db } from '../db/prisma';

config({
  path: '.env.test',
});

jest.setTimeout(30000);

beforeAll(async () => {
  await db.$connect();
  const deletePet = db.pet.deleteMany();
  const deleteUser = db.user.deleteMany();
  await db.$transaction([deletePet, deleteUser]);
});

beforeEach(async () => {
  jest.resetAllMocks();

  const deletePet = db.pet.deleteMany();
  const deleteUser = db.user.deleteMany();
  await db.$transaction([deletePet, deleteUser]);
});

afterAll(async () => {
  await db.$disconnect();
});
