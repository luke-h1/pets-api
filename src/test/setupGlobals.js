import './setEnvVars';
import { config } from 'dotenv';
import { db } from '../db/prisma';
import redis from '../db/redis';

config({
  path: '.env.test',
});

jest.setTimeout(30000);

beforeAll(async () => {
  const instance = redis.getInstance();
  await db.$connect();
  const deletePet = db.pet.deleteMany();
  const deleteUser = db.user.deleteMany();
  instance.flushall();
  await db.$transaction([deletePet, deleteUser]);
});

beforeEach(async () => {
  const instance = redis.getInstance();
  jest.resetAllMocks();

  const deletePet = db.pet.deleteMany();
  const deleteUser = db.user.deleteMany();
  instance.flushall();

  await db.$transaction([deletePet, deleteUser]);
});

afterAll(async () => {
  await db.$disconnect();
});
