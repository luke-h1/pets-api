import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Pet } from '../entities/Pet';
import { Tag } from '../entities/Tag';
import { User } from '../entities/User';

const options: DataSourceOptions = {
  applicationName: 'pets-api',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  name: process.env.POSTGRES_DB_NAME,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [Pet, Tag, User],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
};

export const dataSource =
  process.env.NODE_ENV === 'test'
    ? new DataSource({
        ...options,
        port: 5555,
        migrationsRun: true,
        dropSchema: true,
      })
    : new DataSource({
        ...options,
      });
