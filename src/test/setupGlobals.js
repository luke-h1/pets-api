import { db } from '../db/prisma';

jest.setTimeout(10000);

beforeAll(async () => {
  await db.$connect();
});

beforeEach(async () => {
  jest.resetAllMocks();

  const deleteUser = db.user.deleteMany();
  const deleteRole = db.pet.deleteMany();
  const deleteTag = db.tag.deleteMany();

  await db.$transaction([deleteUser, deleteRole, deleteTag]);
});

afterAll(async () => {
  await db.$disconnect();
});
