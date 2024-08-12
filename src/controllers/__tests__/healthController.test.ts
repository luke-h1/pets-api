import supertest from 'supertest';
import CreateServer from '../../server';

const server = CreateServer;
const app = server.init();

describe('health', () => {
  test('healthcheck responds when db & cache is ok', async () => {
    const { body, statusCode } = await supertest(app)
      .get('/api/healthcheck')
      .set('Accept', 'application/json');
    expect(statusCode).toBe(200);
    expect(body).toEqual({ cache: true, db: true, status: 'OK' });
  });

  test('healthcheck responds with xml response when db & cache is ok', async () => {
    const { text, statusCode } = await supertest(app)
      .get('/api/healthcheck')
      .set('Accept', 'application/xml');

    expect(statusCode).toBe(200);
    expect(text).toEqual(
      '<health><db>true</db><cache>true</cache><status>OK</status></health>',
    );
  });
});
