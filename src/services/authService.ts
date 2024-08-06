import 'reflect-metadata';
import omit from 'lodash/omit';
import { db } from '../db/prisma';
import RedisDatabase from '../db/redis';
import NotFoundError from '../errors/NotFoundError';
import { authErrorCodes } from '../errors/auth';
import { CreateUserInput, LoginUserInput } from '../schema/auth.schema';
import logger from '../utils/logger';
import PasswordService from './passwordService';

export default class AuthService {
  private readonly redis: typeof RedisDatabase;

  private readonly passwordService: PasswordService;

  constructor() {
    this.redis = RedisDatabase;
    this.passwordService = new PasswordService();
  }

  async register(user: CreateUserInput['body']) {
    const hashedPassword = await this.passwordService.hashPassword(
      user.password,
    );

    const existingUser = await db.user.findFirst({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (existingUser?.email === user.email) {
      logger.warn(`${authErrorCodes.EmailAlreadyExists} triggered`);
      return authErrorCodes.EmailAlreadyExists;
    }
    const u = await db.user.create({
      data: {
        ...user,
        role: 'USER',
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        password: false,
      },
    });
    return u;
  }

  async login(user: LoginUserInput['body']) {
    const u = await db.user.findFirst({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });

    if (!u) {
      logger.warn(
        `${authErrorCodes.UserNotFound} triggered for user ${user.email}`,
      );
      return authErrorCodes.UserNotFound;
    }

    const isValidPassword = await this.passwordService.isValidPassword({
      hashedPassword: u.password,
      plainTextPassword: user.password,
    });

    if (!isValidPassword) {
      logger.warn(
        `${authErrorCodes.InvalidCredentials} triggered for user ${user.email}`,
      );
      return authErrorCodes.InvalidCredentials;
    }

    return omit(u, 'password');
  }

  // async resetPassword(user: ResetPasswordInput['body']): Promise<boolean> {
  //   const u = await db.user.findFirst({
  //     where: {
  //       email: user.email,
  //     },
  //   });

  //   if (!u) {
  //     return false;
  //   }

  //   const token = v4();

  //   const PREFIX = 'AUTH_FORGOT_PASSWORD';

  //   const result = await this.redis.setWithExpr(`${PREFIX}${token}`, u.id, {
  //     token: 'EX',
  //     time: 1000 * 60 * 60 * 24 * 1, // 1 day to reset pwd
  //   });
  //   return result;
  // }

  async deleteAccount(id: string) {
    const user = await db.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundError({
        code: authErrorCodes.UserNotFound,
        title: 'User not found',
        message: 'User not found',
        statusCode: 404,
      });
    }

    try {
      await db.user.delete({
        where: { id },
      });
      return true;
    } catch (e) {
      logger.warn(`Issue deleting account with id: ${id}`);
      return false;
    }
  }
}
