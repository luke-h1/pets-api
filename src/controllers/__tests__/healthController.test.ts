import supertest from 'supertest';
import database from '../../db/database';
import RedisDatabase from '../../db/redis';
import CreateServer from '../../server';

const server = CreateServer;

const app = server.init();

const redis = RedisDatabase.getInstance();

describe('health', () => {
  beforeAll(async () => {
    const orm = await database.getInstance();
    orm.config.set('dbName', 'express-test-db');
    orm.config.getLogger().setDebugMode(false);
    await orm.getSchemaGenerator().clearDatabase();
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    const orm = await database.getInstance();
    await orm.close();
  });

  test('global error handler returns 404', async () => {
    const { body, statusCode } = await supertest(app).get('/');

    expect(statusCode).toEqual(404);

    expect(body).toEqual({
      code: 'NotFound',
      message:
        'The requested resource could not be found. Please check your query and try again.',
      statusCode: 404,
      title: 'The requested resource could not be found.',
      type: 'Not Found',
    });
  });

  test('healthcheck responds when db & cache is ok', async () => {
    const { body, statusCode } = await supertest(app).get('/api/healthcheck');

    expect(statusCode).toBe(200);
    expect(body).toEqual({ cache: true, db: true, status: 'OK' });
  });

  test('healthcheck responds when db & cache is not connected', async () => {
    const orm = await database.getInstance();
    await orm.close();

    redis.on('close', () => {
      return null;
    });

    redis.disconnect();

    const { body, statusCode } = await supertest(app).get('/api/healthcheck');
    expect(statusCode).toBe(500);
    expect(body).toEqual({
      cache: false,
      db: false,
      message: 'Cannot connect to DB and cache',
      status: 'ERROR',
    });
  });
});
