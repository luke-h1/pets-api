import {
  CreateUserInput,
  LoginUserInput,
  ResetPasswordInput,
} from '@api/schema/auth.schema';
import { Request } from 'express';

export type RegisterRequest = Request<{}, {}, CreateUserInput['body']>;

export type LoginRequest = Request<{}, {}, LoginUserInput['body']>;

export type ResetPasswordRequest = Request<{}, {}, ResetPasswordInput['body']>;
