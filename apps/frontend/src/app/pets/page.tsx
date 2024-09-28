'use client';

import { Heading, Box, Grid, Spinner, Stack, Text } from '@chakra-ui/react';
import Page from '@frontend/components/Page/Page';
import Pagination from '@frontend/components/Pagination';
import PetCard from '@frontend/components/PetCard';
import SortControls from '@frontend/components/SortControls';
import petQueries from '@frontend/queries/petQueries';
import { SortOrder } from '@frontend/services/petService';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';

function PetsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');

  const {
    data: petsData,
    isError,
    isFetching,
    isLoading,
  } = useQuery({
    ...petQueries.list({
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      order: searchParams.get('order') as SortOrder,
      pageSize: 10,
    }),
    staleTime: 3000,
  });

  const { paging, results: pets } = petsData ?? {};

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  if (isError) {
    return <Page>Error</Page>;
  }

  if (isLoading || isFetching) {
    return (
      <Page>
        <Stack>
          <Spinner size="xl" />
        </Stack>
      </Page>
    );
  }

  if (!pets || !paging) {
    return <Page>No pets found</Page>;
  }

  return (
    <Suspense fallback={<p>loading</p>}>
      <Page>
        <Heading as="h1" marginBottom={2}>
          Pets
        </Heading>
        <Text fontSize="large" marginBottom="0.75rem">
          {paging?.totalPages} Total results
        </Text>

        <Box maxW={200}>
          {pets && pets.length > 0 && (
            <SortControls
              onChange={e => {
                router.push(`?${createQueryString('order', e)}`);
                setSortBy(e);
              }}
              sortBy={sortBy}
              selected={searchParams.get('order') === sortBy}
              options={[
                {
                  label: 'Ascending',
                  value: 'asc',
                },
                {
                  label: 'Descending',
                  value: 'desc',
                },
              ]}
            />
          )}
        </Box>

        <Box paddingY="1rem">
          <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
            {pets && pets.map(p => <PetCard pet={p} key={p.id} />)}
          </Grid>
        </Box>
        <Box marginBottom="1rem">
          <Pagination paging={paging} />
        </Box>
      </Page>
    </Suspense>
  );
}

// workaround to get around
/* 
fix Generating static pages (0/7) [= ] ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/pets". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
*/
export default function PetsPage() {
  return (
    <Suspense fallback={<p>loading</p>}>
      <PetsContent />
    </Suspense>
  );
}
