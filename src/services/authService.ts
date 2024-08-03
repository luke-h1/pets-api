import bcrypt from 'bcryptjs';
import Database from '../db/database';
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

  constructor() {
    this.db = Database;
  }

  async register(user: CreateUserInput['body']) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const db = await this.db.getInstance();
    const userRepository = db.em.getRepository(User);

    const emailExists = await userRepository.findOne({
      email: user.email,
    });

    if (emailExists) {
      logger.warn(`${authErrorCodes.EmailAlreadyExists} triggered`);
      return authErrorCodes.EmailAlreadyExists;
    }

    const result = db.em.create(User, {
      ...user,
      role: role.user,
      fullName: `${user.firstName} + ${user.lastName}`,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await db.em.flush();

    return result;
  }

  async login(user: LoginUserInput['body']) {
    const db = await this.db.getInstance();
    const userRepository = db.em.getRepository(User);

    const u = await userRepository.findOne({ email: user.email });

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

  async resetPassword(user: ResetPasswordInput['body']) {
    throw new Error('not implemented');
  }

  async deleteAccount(id: string) {
    const db = await this.db.getInstance();
    const userRepository = db.em.getRepository(User);

    const user = await userRepository.findOne({
      id,
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
      await Promise.all([
        await db.em.nativeDelete(User, id),
        await db.em.flush(),
      ]);
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
