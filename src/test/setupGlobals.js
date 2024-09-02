import './setEnvVars';
import { config } from 'dotenv';
import { db } from '../db/prisma';
import redis from '../db/redis';

const doCleanup = async () => {
  const instance = redis.getInstance();
  instance.flushall();
  await db.$connect();
  const deletePet = db.pet.deleteMany();
  const deleteUser = db.user.deleteMany();
  await db.$transaction([deletePet, deleteUser]);
};

config({
  path: '.env.test',
});

jest.setTimeout(30000);

beforeAll(async () => {
  await doCleanup();
});

beforeEach(async () => {
  jest.resetAllMocks();
  await doCleanup();
});

afterEach(async () => {
  // Cleanup any fake timers that have been set, or
  // these will leak out to other test cases.
  if (jest.isMockFunction(setTimeout) || setTimeout.clock) {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  }
  await doCleanup();
});

afterAll(async () => {
  await doCleanup();
  await db.$disconnect();
});
