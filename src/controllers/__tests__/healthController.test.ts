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

    orm.setOptions({
      applicationName: 'express-test-db',
      name: 'express-test-db',
    });
  });

  beforeEach(async () => {
    jest.resetAllMocks();
    await database.getInstance();
  });

  afterAll(async () => {});

  test('healthcheck responds when db & cache is ok', async () => {
    const { body, statusCode } = await supertest(app).get('/api/healthcheck');

    expect(statusCode).toBe(200);
    expect(body).toEqual({ cache: true, db: true, status: 'OK' });
  });

  test('healthcheck responds when db & cache is not connected', async () => {
    const orm = await database.getInstance();
    await orm.destroy();

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
