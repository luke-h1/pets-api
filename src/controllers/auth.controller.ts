import {
  ACCESS_TOKEN_COOKIE,
  checkToken,
  sendAuthTokens,
} from '@api/utils/createAuthTokens';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import omit from 'lodash/omit';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import { authErrorCodes } from '../errors/auth';
import { LoginRequest, RegisterRequest } from '../requests/auth.requests';
import AuthService from '../services/auth.service';
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
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['body', 'email'],
            message: 'Email already exists',
          },
        ],
      });
    }

    return res.status(201).json(omit(result, 'password'));
  }

  async login(req: LoginRequest, res: Response) {
    const result = await this.authService.login(req.body);

    if (result === authErrorCodes.InvalidCredentials) {
      throw new BadRequestError({
        message: 'Invalid credentials',
        statusCode: 401,
        type: 'Unauthorized',
        code: authErrorCodes.InvalidCredentials,
        title: 'Bad credentials supplied',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['body', 'email'],
            message: 'Invalid email or password',
          },
        ],
      });
    }

    if (result === authErrorCodes.UserNotFound) {
      throw new NotFoundError({
        code: authErrorCodes.UserNotFound,
        title: 'User not found',
        statusCode: 404,
        message: 'User not found',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['body', 'email'],
            message: 'User not found',
          },
        ],
      });
    }
    // auth user
    sendAuthTokens(res, result as User);

    return res.status(200).json(omit(result, 'password'));
  }

  async logout(req: Request, res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE);

    return res.status(200).json({ message: 'Logged out' });
  }

  // async resetPassword(req: ResetPasswordRequest, res: Response) {
  //   const result = await this.authService.resetPassword(req.body);

  //   if (result) {
  //     return res.status(200).json({ message: 'Password reset' });
  //   }

  //   return res.status(400).json({ message: 'Password reset failed' });
  // }

  async deleteAccount(req: Request, res: Response) {
    const result = await this.authService.deleteAccount(req.body);

    if (result) {
      return res.status(200).json({ message: 'Account deleted' });
    }

    return res.status(400).json({ message: 'Account deletion failed' });
  }

  async isAuthenticated(req: Request, res: Response) {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];

    if (!accessToken) {
      return res.status(200).json({ isAuth: false });
    }

    const result = await checkToken(accessToken);

    if (!result || !result.user || !result.userId) {
      return res.status(200).json({ isAuth: false });
    }

    return res.status(200).json({ isAuth: true });
  }
}
