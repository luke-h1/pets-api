import {
  CreateUserInput,
  LoginUserInput,
} from '@validation/schema/auth.schema';
import { ServerValidationError } from '@validation/schema/response.schema';
import { User } from '@validation/schema/user.schema';
import { petApi } from './api';

type RegisterResponse = User | ServerValidationError;
type LoginResponse = Pick<User, 'id' | 'email'> | ServerValidationError;

const authService = {
  isAuth: async (): Promise<{ isAuth: boolean }> => {
    return petApi.get('/auth');
  },
  register: async (input: CreateUserInput): Promise<RegisterResponse> => {
    return petApi.post('/auth/register', input);
  },
  login: async (input: LoginUserInput): Promise<LoginResponse> => {
    return petApi.post('/auth/login', input);
  },
  logout: async (): Promise<void> => {
    return petApi.post('/auth/logout');
  },
} as const;

export default authService;
