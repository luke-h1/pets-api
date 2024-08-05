import { db } from '../db/prisma';

jest.setTimeout(30000);

beforeAll(async () => {
  await db.$connect();
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
