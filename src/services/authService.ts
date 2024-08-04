import 'reflect-metadata';
import omit from 'lodash/omit';
import { v4 } from 'uuid';
import Database from '../db/database';
import RedisDatabase from '../db/redis';
import { User, role } from '../entities/User';
import BadRequestError from '../errors/BadRequestError';
import { authErrorCodes } from '../errors/auth';
import {
  CreateUserInput,
  LoginUserInput,
  ResetPasswordInput,
} from '../schema/auth.schema';
import logger from '../utils/logger';
import PasswordService from './passwordService';

export default class AuthService {
  private readonly db: typeof Database;

  private readonly redis: typeof RedisDatabase;

  private readonly passwordService: PasswordService;

  constructor() {
    this.db = Database;
    this.redis = RedisDatabase;
    this.passwordService = new PasswordService();
  }

  async register(user: CreateUserInput['body']) {
    const hashedPassword = await this.passwordService.hashPassword(
      user.password,
    );

    const db = await this.db.getInstance();
    let u: User | undefined;

    try {
      const { raw } = await db
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          ...user,
          role: role.user,
          password: hashedPassword,
        })
        .returning('*')
        .execute();

      // eslint-disable-next-line prefer-destructuring
      u = raw[0];
    } catch (error) {
      if ((error as { code: string }).code === '23505') {
        logger.warn(`${authErrorCodes.EmailAlreadyExists} triggered`);
        return authErrorCodes.EmailAlreadyExists;
      }
    }
    return u;
  }

  async login(user: LoginUserInput['body']) {
    const db = await this.db.getInstance();

    const repo = db.getRepository(User);

    const u = await repo.findOne({
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

  async resetPassword(user: ResetPasswordInput['body']): Promise<boolean> {
    const db = await this.db.getInstance();
    const userRepository = db.getRepository(User);

    const u = await userRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (!u) {
      return false;
    }

    const token = v4();

    const PREFIX = 'AUTH_FORGOT_PASSWORD';

    const result = await this.redis.setWithExpr(`${PREFIX}${token}`, u.id, {
      token: 'EX',
      time: 1000 * 60 * 60 * 24 * 1, // 1 day to reset pwd
    });
    return result;
  }

  async deleteAccount(id: string) {
    const db = await this.db.getInstance();
    const userRepository = db.getRepository(User);

    const user = await userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new BadRequestError({
        code: authErrorCodes.UserNotFound,
        title: 'User not found',
        message: 'User not found',
        statusCode: 404,
      });
    }

    try {
      await userRepository.delete(id);
      return true;
    } catch (e) {
      logger.warn(`Issue deleting account with id: ${id}`);
      return false;
    }
  }
}
