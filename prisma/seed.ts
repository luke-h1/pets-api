/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import { Pet, PetStatus, Role, User } from '@prisma/client';
import { db } from '../src/db/prisma';
import { testImages } from '../src/test/testImages';

const USER_BATCH_SIZE = 10; // Number of users per batch
const PETS_PER_USER = 1000; // Number of pets per user
const TOTAL_USERS = 50; // Total number of users (50,000 pets / 1,000 pets per user)

type UserWithoutPrismaKeys = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

type PetWithoutPrismaKeys = Omit<
  Pet,
  'id' | 'createdAt' | 'updatedAt' | 'creatorId'
> & { creatorId: string };

// Function to generate user data
function generateUserData(index: number): UserWithoutPrismaKeys {
  return {
    email: `user${index}@test.com`,
    firstName: `firstName${index}`,
    lastName: `lastName${index}`,
    password: 'password123',
    role: Role.USER,
  };
}

function generatePetData(
  index: number,
  creatorId: string,
): PetWithoutPrismaKeys {
  return {
    name: `pet${index}`,
    status: PetStatus.AVAILABLE,
    age: '1',
    birthDate: '1',
    breed: 'breed',
    description: 'description',
    images: testImages,
    tags: ['tag1', 'tag2'],
    creatorId,
  };
}

async function main() {
  console.info('Seeding database...');
  console.info('-------------------');

  for (let i = 0; i < TOTAL_USERS; i += USER_BATCH_SIZE) {
    const users: UserWithoutPrismaKeys[] = [];
    for (let j = 0; j < USER_BATCH_SIZE; j += 1) {
      const userIndex = i + j;
      if (userIndex >= TOTAL_USERS) break;
      users.push(generateUserData(userIndex));
    }

    console.time('Inserting batch');
    await db.$transaction(
      async prisma => {
        await prisma.user.createMany({
          data: users,
          skipDuplicates: true,
        });

        const createdUsers = await prisma.user.findMany({
          where: {
            email: {
              in: users.map(user => user.email),
            },
          },
        });

        for (const user of createdUsers) {
          const pets: PetWithoutPrismaKeys[] = [];
          for (let k = 0; k < PETS_PER_USER; k += 1) {
            pets.push(generatePetData(k, user.id));
          }

          // Batch insert pets for each user
          const PET_BATCH_SIZE = 1000; // Adjust batch size as needed
          for (let l = 0; l < pets.length; l += PET_BATCH_SIZE) {
            const petBatch = pets.slice(l, l + PET_BATCH_SIZE);
            await prisma.pet.createMany({
              data: petBatch,
              skipDuplicates: true,
            });
          }
        }
      },
      { timeout: 1000000 },
    );

    // Log the current number of records in the User and Pet tables
    const userCount = await db.user.count();
    const petCount = await db.pet.count();
    console.info(`Inserted batch ${i / USER_BATCH_SIZE + 1}`);
    console.info(`Current number of users: ${userCount}`);
    console.info(`Current number of pets: ${petCount}`);

    console.timeEnd('Inserting batch');

    // Update progress indicator
    process.stdout.write(
      `Progress: ${(((i + USER_BATCH_SIZE) / TOTAL_USERS) * 100).toFixed(2)}% complete\r`,
    );
  }

  console.info('\nSeeding completed.');
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
