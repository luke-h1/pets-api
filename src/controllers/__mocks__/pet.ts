import { CreatePetInput } from '@api/schema/pet.schema';

export const testImages: CreatePetInput['body']['images'] = [
  'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/1723990567355-GTgYHDgWsAAX4HO.png',
  'https://pets-api-staging-assets.s3.eu-west-2.amazonaws.com/1723990567355-GTgYHDgWsAAX4HO.png',
];

export const pets: CreatePetInput['body'][] = [
  {
    name: 'Buddy',
    breed: 'Golden Retriever',
    status: 'AVAILABLE',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
  {
    name: 'Mittens',
    breed: 'Siamese',
    status: 'ADOPTED',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
  {
    name: 'Charlie',
    breed: 'Labrador Retriever',
    status: 'AVAILABLE',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
  {
    name: 'Whiskers',
    breed: 'Maine Coon',
    status: 'PENDING',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
  {
    name: 'Max',
    breed: 'Beagle',
    status: 'ADOPTED',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
  {
    name: 'Luna',
    breed: 'Bengal',
    status: 'AVAILABLE',
    age: '12',
    birthDate: '2022',
    description: 'dog',
    tags: ['dog'],
    images: testImages,
  },
];
