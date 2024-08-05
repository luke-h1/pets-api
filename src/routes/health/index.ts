import { Express } from 'express';
import HealthController from '../../controllers/healthController';

export default class HealthRoutes {
  private readonly app: Express;

  private readonly healthController: HealthController;

  constructor(app: Express) {
    this.app = app;
    this.healthController = new HealthController();
  }

  public initRoutes(): void {
    this.app.get('/api/healthcheck', (req, res) => {
      return this.healthController.health(req, res);
    });

    this.app.head('/', (req, res) => {
      return res.status(200).send();
    });
  }
}
