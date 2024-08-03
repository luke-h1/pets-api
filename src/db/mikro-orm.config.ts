import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Pet } from '../entities/Pet';
import { Tag } from '../entities/Tag';
import { User } from '../entities/User';

export default defineConfig({
  entities: [User, Pet, Tag],
  dbName: 'pets',
  user: 'pets',
  password: 'pets',
  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV === 'development',
  migrations: {
    transactional: true,
    path: './dist/src/db/migrations',
    pathTs: './src/db/migrations',
  },
  extensions: [Migrator],
  allowGlobalContext: true,
});
