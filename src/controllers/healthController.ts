import { Request, Response } from 'express';
import HealthService from '../services/healthService';

export default class HealthController {
  private readonly healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  public async health(req: Request, res: Response) {
    const { cache, db } = await this.healthService.health();

    if (!db || !cache) {
      const message = `Cannot connect to ${!db ? 'DB' : ''}${!db && !cache ? ' and ' : ''}${!cache ? 'cache' : ''}`;

      return res.status(500).json({
        db: !!db,
        cache: !!cache,
        status: 'ERROR',
        message,
      });
    }

    return res.status(200).json({
      db: true,
      cache: true,
      status: 'OK',
    });
  }
}
