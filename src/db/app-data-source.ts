import { DataSource } from 'typeorm';
import { Pet } from '../entities/Pet';
import { Tag } from '../entities/Tag';
import { User } from '../entities/User';

export const dataSource = new DataSource({
  applicationName: 'pets-api',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  name: process.env.POSTGRES_DB_NAME,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [Pet, Tag, User],
  migrations: [],
  logging: process.env.NODE_ENV === 'development',
});
