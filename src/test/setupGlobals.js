import './setEnvVars';
import { config } from 'dotenv';
import { db } from '../db/prisma';
import testRedis from './redis';

const doCleanup = async () => {
  await db.$connect();
  const deletePet = db.pet.deleteMany();
  const deleteUser = db.user.deleteMany();
  await db.$transaction([deletePet, deleteUser]);
  await db.$disconnect();

  await testRedis.flushall();
};

config({
  path: '.env.test',
});

jest.setTimeout(30000);

beforeAll(async () => {
  // reset and migrate the database
  await doCleanup();
});

beforeEach(async () => {
  jest.resetAllMocks();
  await doCleanup();
});

afterAll(async () => {
  await doCleanup();
});
