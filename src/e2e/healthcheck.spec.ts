import { test, expect } from '@playwright/test';

test.describe('healthcheck', () => {
  test('should return ok when db & cache is up', async ({ request }) => {
    const result = await request.get('/api/healthcheck');
    expect(result.status()).toBe(200);

    const response = await result.json();
    expect(response).toEqual({
      cache: true,
      db: true,
      status: 'OK',
    });
  });
});
