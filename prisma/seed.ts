import { PetStatus, Role } from '@prisma/client';
import { db } from '../src/db/prisma';

async function main() {
  await db.user.upsert({
    where: { email: 'luke@test.com' },
    update: {},
    create: {
      email: 'luke@test.com',
      firstName: 'luke',
      lastName: 'test',
      password: 'password123',
      role: Role.ADMIN,
      pets: {
        create: {
          name: 'Buddy',
          age: '3',
          birthDate: '2020-05-15',
          breed: 'Golden Retriever',
          description:
            'Buddy is a friendly and energetic Golden Retriever who loves to play fetch.',
          photoUrl:
            'https://images.dog.ceo/breeds/segugio-italian/n02090722_001.jpg',
          status: PetStatus.AVAILABLE,
          tags: ['friendly', 'energetic'],
        },
      },
    },
  });
  await db.user.upsert({
    where: { email: 'bob@test.com' },
    update: {},
    create: {
      email: 'bob@test.com',
      firstName: 'bob',
      lastName: 'test',
      password: 'password123',
      role: Role.USER,
      pets: {
        create: {
          name: 'Mittens',
          age: '4',
          birthDate: '2019-02-20',
          breed: 'Tabby',
          description:
            'Mittens is a sweet and affectionate Tabby cat who loves to cuddle.',
          photoUrl:
            'https://images.pexels.com/photos/10891037/pexels-photo-10891037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          tags: ['cute', 'fluffy'],
        },
      },
    },
  });
  await db.user.upsert({
    where: { email: 'alisce@test.com' },
    update: {},
    create: {
      email: 'alice@test.com',
      firstName: 'alice',
      lastName: 'test',
      password: 'password123',
      role: Role.USER,
      pets: {
        create: {
          name: 'Whiskers',
          age: '2',
          birthDate: '2021-08-10',
          breed: 'Siamese',
          description:
            'Whiskers is a curious and playful Siamese cat who loves to explore and climb.',
          photoUrl:
            'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          status: PetStatus.AVAILABLE,
          tags: ['curious', 'playful'],
        },
      },
    },
  });
}
// eslint-disable-next-line no-console
console.info('Seeding database...');
console.info('-------------------');
console.info('seeded DB...');
main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async e => {
    // eslint-disable-next-line no-console
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
