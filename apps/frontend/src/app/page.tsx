'use client';

import {
  Button,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import Page from '@frontend/components/Page/Page';
import { FiArrowUpRight } from 'react-icons/fi';

export default function Home() {
  return (
    <Page>
      <Stack
        as="section"
        alignItems="center"
        direction={{ base: 'column-reverse', md: 'row' }}
        w="full"
        spacing={12}
      >
        <VStack alignItems="flex-start" w="full" spacing={3}>
          <Stack
            alignItems="center"
            justifyContent={{ base: 'center', md: 'flex-start' }}
            direction={{ base: 'column', md: 'row' }}
            w="full"
            spacing={3}
          >
            <Heading as="h1" size="lg">
              Welcome to Pets
            </Heading>
          </Stack>
          <Text as="h2" lineHeight="175%">
            Pets is a pet adoption platform
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
            <Button
              as={Link}
              justifyContent={{ base: 'flex-start', md: 'center' }}
              px={4}
              href="https://github.com/luke-h1/pets-api"
              rightIcon={<Icon as={FiArrowUpRight} />}
              variant="ghost"
            >
              Github
            </Button>
            <Button
              as={Link}
              justifyContent={{ base: 'flex-start', md: 'center' }}
              px={4}
              href="/pets"
              variant="ghost"
            >
              View pets
            </Button>
          </Stack>
        </VStack>
      </Stack>
    </Page>
  );
}
