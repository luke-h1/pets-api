'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import composeProviders from '@frontend/hocs/composeProviders';
import {
  QueryClient,
  QueryClientProvider as BaseQueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { MotionConfig as FramerMotionConfig } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface Props {
  children: ReactNode;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  );
}

function MotionConfig({ children }: { children: ReactNode }) {
  return (
    <FramerMotionConfig reducedMotion="user">{children}</FramerMotionConfig>
  );
}

function QueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // @ts-expect-error - types are wrong in react-query for suspense
            suspense: true,
          },
        },
      }),
  );

  return (
    <BaseQueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
    </BaseQueryClientProvider>
  );
}

const ComposedProviders = composeProviders(
  ThemeProvider,
  MotionConfig,
  QueryClientProvider,
);

export default function Providers({ children }: Props) {
  return <ComposedProviders>{children}</ComposedProviders>;
}
