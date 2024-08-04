import { Pet } from '@prisma/client';

export const pets: Omit<Pet, 'createdAt' | 'updatedAt' | 'id' | 'creatorId'>[] =
  [
    {
      name: 'Buddy',
      type: 'dog',
      breed: 'Golden Retriever',
      status: 'AVAILABLE',
      birthDate: new Date('2019-01-01'),
      photoUrl: 'https://images.unsplash.com/photo-1560807707-8cc777a4d2f9',
    },
    {
      name: 'Mittens',
      type: 'cat',
      breed: 'Siamese',
      status: 'ADOPTED',
      birthDate: new Date('2020-05-15'),
      photoUrl: 'https://images.unsplash.com/photo-1592194996308-7d9c3f8d4a2b',
    },
    {
      name: 'Charlie',
      type: 'dog',
      breed: 'Labrador Retriever',
      status: 'AVAILABLE',
      birthDate: new Date('2018-07-22'),
      photoUrl: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8',
    },
    {
      name: 'Whiskers',
      type: 'cat',
      breed: 'Maine Coon',
      status: 'PENDING',
      birthDate: new Date('2017-11-11'),
      photoUrl: 'https://images.unsplash.com/photo-1560807707-8cc777a4d2f9',
    },
    {
      name: 'Max',
      type: 'dog',
      breed: 'Beagle',
      status: 'ADOPTED',
      birthDate: new Date('2016-03-30'),
      photoUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16',
    },
    {
      name: 'Luna',
      type: 'cat',
      breed: 'Bengal',
      status: 'AVAILABLE',
      birthDate: new Date('2021-02-14'),
      photoUrl: 'https://images.unsplash.com/photo-1592194996308-7d9c3f8d4a2b',
    },
  ];
