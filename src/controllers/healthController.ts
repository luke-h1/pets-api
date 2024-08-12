import { Request, Response } from 'express';
import xml from 'xml';
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

      if (req.accepts('xml')) {
        const responseBody = xml({
          health: [
            { db: !!db },
            { cache: !!cache },
            { status: 'ERROR' },
            { message },
          ],
        });
        return res.status(500).send(responseBody);
      }

      return res.status(500).json({
        db: !!db,
        cache: !!cache,
        status: 'ERROR',
        message,
      });
    }

    if (req.accepts('xml')) {
      return res.status(200).send(
        xml({
          health: [
            {
              db: true,
            },
            { cache: true },
            {
              status: 'OK',
            },
          ],
        }),
      );
    }

    return res.status(200).json({
      db: true,
      cache: true,
      status: 'OK',
    });
  }
}
