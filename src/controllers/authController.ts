import { Request, Response } from 'express';
import z from 'zod';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import { authErrorCodes } from '../errors/auth';
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '../requests/auth';
import AuthService from '../services/authService';
import logger from '../utils/logger';

export default class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: RegisterRequest, res: Response) {
    const result = await this.authService.register(req.body);
    logger.info('User registered', result);

    if (result === authErrorCodes.EmailAlreadyExists) {
      throw new BadRequestError({
        code: authErrorCodes.EmailAlreadyExists,
        title: 'Email already exists',
        statusCode: 400,
        message: 'Email already exists',
      });
    }

    req.session.userId = result.id;

    return res.status(201).json(result);
  }

  async login(req: LoginRequest, res: Response) {
    const result = await this.authService.login(req.body);

    if (result === authErrorCodes.UserNotFound) {
      throw new NotFoundError({
        code: authErrorCodes.UserNotFound,
        title: 'User not found',
        statusCode: 404,
        message: 'User not found',
      });
    }

    req.session.userId = result.id;

    return res.status(200).json(result);
  }

  async logout(req: Request, res: Response) {
    throw new Error('Not implemented');
  }

  async resetPassword(req: ResetPasswordRequest, res: Response) {
    throw new Error('Not implemented');
  }

  async deleteAccount(req: Request, res: Response) {
    throw new Error('Not implemented');
  }

  async isAuthenticated(req: Request, res: Response) {
    throw new Error('Not implemented');
  }
}
