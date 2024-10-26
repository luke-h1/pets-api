import { Box, Heading, Image, Text } from '@chakra-ui/react';
import Page from '@frontend/components/Page/Page';
import petService from '@frontend/services/petService';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

interface Props {
  params: {
    id: string;
  };
}

export default async function PetPage({ params }: Props) {
  const { id } = params;

  const pet = await petService.getPet(id);

  if (!pet) {
    notFound();
  }

  return (
    <Page>
      <Box>
        <Heading fontWeight="bold">{pet.name}</Heading>
        <Text fontSize="2xl">
          Age: {pet.age} - Breed: {pet.breed}
        </Text>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(400px, 1fr))"
        >
          {pet.images.map(img => (
            <Box key={img} marginRight="0.5rem">
              <Image
                key={img}
                src={img}
                alt={pet.name}
                width={500}
                height={500}
                style={{
                  borderRadius: '0.5rem',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
        <Text fontSize="22px" marginTop="0.75rem">
          {pet.description}
        </Text>
      </Box>
    </Page>
  );
}
