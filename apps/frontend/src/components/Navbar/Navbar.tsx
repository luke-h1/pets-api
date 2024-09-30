'use client';

import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Avatar,
} from '@chakra-ui/react';
import { useAuthContext } from '@frontend/context/AuthContext';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

interface NavigationLink {
  id: number;
  title: string;
  href: string;
}

const links: NavigationLink[] = [
  {
    id: 1,
    title: 'Home',
    href: '/',
  },
  {
    id: 2,
    title: 'About',
    href: '/about',
  },
  {
    id: 3,
    title: 'Pets',
    href: '/pets',
  },
];

function NavLink(link: NavigationLink) {
  const { href, id, title } = link;
  return (
    <Box
      as={NextLink}
      px={2}
      py={1}
      id={id.toString()}
      rounded="md"
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={href}
    >
      {title}
    </Box>
  );
}

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuth, logout } = useAuthContext();
  const router = useRouter();

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems="center">
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            {links &&
              links.map(link => (
                <NavLink
                  key={link.id}
                  id={link.id}
                  href={link.href}
                  title={link.title}
                />
              ))}
          </HStack>
        </HStack>

        <Flex alignItems="center">
          {isAuth ? (
            <Button
              variant="solid"
              colorScheme="teal"
              size="sm"
              mr={4}
              onClick={() => logout()}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="solid"
              colorScheme="teal"
              size="sm"
              mr={4}
              onClick={() => router.push('/auth/login')}
            >
              Login
            </Button>
          )}

          {isAuth ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar size="sm" src="/static/avatar.png" />
              </MenuButton>
              <MenuList>
                <MenuItem>My listings</MenuItem>
                <MenuItem>Create pet</MenuItem>
                <MenuDivider />
                <MenuItem>pets</MenuItem>
              </MenuList>
            </Menu>
          ) : null}
        </Flex>
      </Flex>

      {/* {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as="nav" spacing={4}>
            {Links.map(link => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null} */}
    </Box>
  );
}
