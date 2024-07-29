import { Express } from 'express';
import HealthController from '../../controllers/health';

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
  }
}
