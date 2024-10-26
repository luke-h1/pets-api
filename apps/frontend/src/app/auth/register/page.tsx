'use client';

import {
  Alert,
  Avatar,
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Stack,
  useToast,
} from '@chakra-ui/react';
import AlertInput from '@frontend/components/form/AlertInput';
import authService from '@frontend/services/authService';
import toErrorMap from '@frontend/util/form/toErrorMap';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateUserInput,
  registerPayload,
} from '@validation/schema/auth.schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Path, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();
  const toast = useToast();

  const handleShowClick = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateUserInput['body']>({
    resolver: zodResolver(z.object(registerPayload)),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<CreateUserInput['body']> = async data => {
    const result = await authService.register(data);

    if (result && 'errors' in result) {
      toast({
        title: 'Register',
        description: 'Error registering',
        status: 'error',
        duration: 3000,
        isClosable: true,
        colorScheme: 'red',
      });
      const formattedErrors = toErrorMap(result.errors);

      if (formattedErrors) {
        formattedErrors.forEach(({ field, message }) => {
          setError(field as Path<CreateUserInput['body']>, { message });
        });
      }
    } else {
      setTimeout(() => {
        toast({
          title: 'Register',
          description: 'Register successfull!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        router.push('/auth/login');
      }, 3000);
    }
  };

  return (
    <>
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Register</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          {Boolean(Object.keys(errors)?.length) && (
            <Alert backgroundColor="red" color="#ececee">
              There are errors in the form.
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup
                  display="flex"
                  flexDir="column"
                  marginBottom="0.45rem"
                >
                  <InputLeftElement pointerEvents="none" />
                  <Input
                    type="text"
                    placeholder="First name"
                    {...register('firstName')}
                    aria-invalid={Boolean(errors.firstName)}
                  />
                  {errors.firstName && (
                    <Box>
                      <AlertInput>{errors.firstName.message}</AlertInput>
                    </Box>
                  )}
                </InputGroup>
                <InputGroup display="flex" flexDir="column">
                  <InputLeftElement pointerEvents="none" />
                  <Input
                    type="text"
                    placeholder="last name"
                    {...register('lastName')}
                    aria-invalid={Boolean(errors.lastName)}
                  />
                  {errors.lastName && (
                    <Box>
                      <AlertInput>{errors.lastName.message}</AlertInput>
                    </Box>
                  )}{' '}
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup display="flex" flexDir="column">
                  <InputLeftElement pointerEvents="none" />
                  <Input
                    type="email"
                    placeholder="email"
                    {...register('email')}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <Box>
                      <AlertInput>{errors.email.message}</AlertInput>
                    </Box>
                  )}{' '}
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
                Register
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        Already joined?{' '}
        <Link color="teal.500" href="/auth/login">
          Login
        </Link>
      </Box>{' '}
    </>
  );
}
