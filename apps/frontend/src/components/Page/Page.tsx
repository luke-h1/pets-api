import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Navbar from '../Navbar/Navbar';

interface Props {
  children: ReactNode;
}

export default function Page({ children }: Props) {
  return (
    <Box>
      <Navbar />
      <Box marginX="auto" paddingX="6" maxW="8xl">
        <Box as="main" id="content" position="relative" zIndex={1} paddingY={6}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
