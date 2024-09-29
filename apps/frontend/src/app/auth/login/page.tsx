'use client';

import {
  Alert,
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Stack,
} from '@chakra-ui/react';
import AlertInput from '@frontend/components/form/AlertInput';
import authService from '@frontend/services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginPayload, LoginUserInput } from '@validation/schema/auth.schema';
import toErrorMap from '@validation/util/toErrorMap';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Path, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleShowClick = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginUserInput['body']>({
    resolver: zodResolver(z.object({ ...loginPayload })),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginUserInput['body']> = async data => {
    const result = await authService.login(data);

    if ('errors' in result) {
      const errs = toErrorMap(result.errors);

      if (errs) {
        errs.forEach(({ field, message }) => {
          setError(field as Path<LoginUserInput['body']>, { message });
        });
      }
    } else {
      console.log('result', result);
      router.push('/pets');
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Login</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          {Boolean(Object.keys(errors)?.length) && (
            <Alert>There are errors in the form.</Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup display="flex" flexDir="column">
                  <InputLeftElement pointerEvents="none" />
                  <Input
                    type="email"
                    placeholder="email address"
                    {...register('email')}
                    aria-invalid={Boolean(errors.email)}
                  />
                  <Box>
                    <AlertInput>{errors?.email?.message}</AlertInput>
                  </Box>
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup display="flex" flexDir="column">
                  <InputLeftElement pointerEvents="none" color="gray.300" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    {...register('password')}
                    aria-invalid={Boolean(errors.password)}
                  />
                  <AlertInput>{errors?.password?.message}</AlertInput>
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                disabled={isSubmitting || !isValid}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{' '}
        <Link color="teal.500" href="/auth/register">
          Register
        </Link>
      </Box>
    </Flex>
  );
}
