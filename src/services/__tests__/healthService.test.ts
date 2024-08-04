import HealthService from '../healthService';

describe('healthService', () => {
  const healthService = new HealthService();

  describe('health', () => {
    test('returns health status', async () => {
      const result = await healthService.health();
      expect(result).toEqual({ db: true, cache: true });
    });
  });
});
