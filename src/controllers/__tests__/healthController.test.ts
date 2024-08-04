import supertest from 'supertest';
import CreateServer from '../../server';

const server = CreateServer;
const app = server.init();

describe('health', () => {
  test('healthcheck responds when db & cache is ok', async () => {
    const { body, statusCode } = await supertest(app).get('/api/healthcheck');
    expect(statusCode).toBe(200);
    expect(body).toEqual({ cache: true, db: true, status: 'OK' });
  });
});
