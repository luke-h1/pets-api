import { db } from '../db/prisma';

jest.setTimeout(10000);

beforeAll(async () => {
  await db.$connect();
});

beforeEach(async () => {
  jest.resetAllMocks();

  const deletePet = db.pet.deleteMany();
  const deleteUser = db.user.deleteMany();
  const deleteTag = db.tag.deleteMany();

  await db.$transaction([deletePet, deleteUser, deleteTag]);
});

afterAll(async () => {
  await db.$disconnect();
});
