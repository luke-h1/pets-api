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
        createMany: {
          data: [
            {
              name: 'Mittens',
              age: '4',
              birthDate: '2019-02-20',
              breed: 'Tabby',
              status: PetStatus.PENDING,
              description:
                'Mittens is a sweet and affectionate Tabby cat who loves to cuddle.',
              photoUrl:
                'https://images.pexels.com/photos/10891037/pexels-photo-10891037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              tags: ['cute', 'fluffy'],
            },
            {
              name: 'Mittens',
              age: '4',
              birthDate: '2019-02-20',
              breed: 'Tabby',
              status: PetStatus.ADOPTED,
              description:
                'Mittens is a sweet and affectionate Tabby cat who loves to cuddle.',
              photoUrl:
                'https://images.pexels.com/photos/10891037/pexels-photo-10891037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              tags: ['cute', 'fluffy'],
            },
          ],
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
        createMany: {
          data: [
            {
              name: 'Chloe',
              age: '2',
              birthDate: '2021-06-18',
              breed: 'Sphynx',
              status: PetStatus.AVAILABLE,
              description:
                'Chloe is a unique Sphynx cat who loves to stay warm.',
              photoUrl:
                'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              tags: ['unique', 'warm'],
            },
            {
              name: 'Leo',
              age: '3',
              birthDate: '2020-09-22',
              breed: 'British Shorthair',
              status: PetStatus.AVAILABLE,
              description:
                'Leo is a friendly British Shorthair cat who loves to play.',
              photoUrl:
                'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              tags: ['friendly', 'playful'],
            },
            {
              name: 'Nala',
              age: '5',
              birthDate: '2018-04-14',
              breed: 'Russian Blue',
              status: PetStatus.AVAILABLE,
              description:
                'Nala is a graceful Russian Blue cat with a calm demeanor.',
              photoUrl:
                'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              tags: ['graceful', 'calm'],
            },
          ],
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
