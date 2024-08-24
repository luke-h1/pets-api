import { Request } from 'express';
import {
  CreateUserInput,
  LoginUserInput,
  ResetPasswordInput,
} from '../schema/auth.schema';

export type RegisterRequest = Request<{}, {}, CreateUserInput['body']>;

export type LoginRequest = Request<{}, {}, LoginUserInput['body']>;

export type ResetPasswordRequest = Request<{}, {}, ResetPasswordInput['body']>;
