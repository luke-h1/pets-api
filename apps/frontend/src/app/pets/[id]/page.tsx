'use client';

import { Box, Heading, Image, Text } from '@chakra-ui/react';
import Page from '@frontend/components/Page/Page';
import petQueries from '@frontend/queries/petQueries';
import { isServer, useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import PhotoGallery from 'react-photo-gallery';

export const runtime = 'edge';

interface Props {
  params: {
    id: string;
  };
}

export default function PetPage({ params }: Props) {
  const { id } = params;

  const {
    data: pet,
    isError,
    isFetching,
    isLoading,
  } = useQuery({
    ...petQueries.get(id),
    enabled: !!id && !isServer,
  });

  if (isError) {
    return <Page>Error</Page>;
  }

  if (isLoading || isFetching) {
    return <Page>Loading...</Page>;
  }

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
        <Text>
          <strong>Description:</strong> {pet.description}
        </Text>
      </Box>
    </Page>
  );
}
