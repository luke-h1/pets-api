import logger from '@api/utils/logger';
import bcrypt from 'bcryptjs';

export default class PasswordService {
  private readonly saltRounds: number;

  constructor() {
    this.saltRounds = 10;
  }

  async isValidPassword({
    plainTextPassword,
    hashedPassword,
  }: {
    plainTextPassword: string;
    hashedPassword: string;
  }): Promise<boolean> {
    const result = await bcrypt.compare(plainTextPassword, hashedPassword);
    console.info('isvalidpassword ->', result);
    return result;
  }

  async hashPassword(plainTextPassword: string): Promise<string> {
    const hash = await bcrypt.hash(plainTextPassword, this.saltRounds);
    logger.info('hashedPassword success');
    return hash;
  }
}
