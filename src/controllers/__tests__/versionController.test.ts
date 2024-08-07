import supertest from 'supertest';
import server from '../../server';

describe('version', () => {
  const app = server.init();

  describe('getVersion', () => {
    test('getVersion', async () => {
      const { body, statusCode } = await supertest(app).get('/api/version');

      expect(body).toEqual({
        deployedAt: 'local',
        deployedBy: 'luke-h1',
      });
      expect(statusCode).toBe(200);
    });
  });
});
