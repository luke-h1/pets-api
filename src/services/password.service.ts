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
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async hashPassword(plainTextPassword: string): Promise<string> {
    return bcrypt.hash(plainTextPassword, this.saltRounds);
  }
}
