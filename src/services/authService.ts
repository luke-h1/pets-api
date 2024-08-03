import bcrypt from 'bcryptjs';
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

export default class AuthService {
  private readonly db: typeof Database;

  private readonly redis: typeof RedisDatabase;

  constructor() {
    this.db = Database;
    this.redis = RedisDatabase;
  }

  async register(user: CreateUserInput['body']) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const db = await this.db.getInstance();

    const userRepository = db.getRepository(User);

    const emailExists = await userRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (emailExists) {
      logger.warn(`${authErrorCodes.EmailAlreadyExists} triggered`);
      return authErrorCodes.EmailAlreadyExists;
    }

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

    return raw[0];
  }

  async login(user: LoginUserInput['body']) {
    const db = await this.db.getInstance();
    const userRepository = db.getRepository(User);

    const u = await userRepository.findOne({ where: { email: user.email } });

    if (!u) {
      logger.warn(`${authErrorCodes.UserNotFound} triggered`);
      return authErrorCodes.UserNotFound;
    }

    const isValidPassword = await bcrypt.compare(user.password, u.password);

    if (!isValidPassword) {
      throw new BadRequestError({
        message: 'Invalid credentials',
        statusCode: 401,
        type: 'Unauthorized',
        code: authErrorCodes.InvalidCredentials,
        title: 'Bad credentials supplied',
      });
    }

    return u;
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

  async isAuthenticated() {
    throw new Error('not implemented');
  }
}
