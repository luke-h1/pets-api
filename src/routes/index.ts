import { Express } from 'express';
import HealthRoutes from './health';

export default class Routes {
  private readonly app: Express;

  private readonly healthRoutes: HealthRoutes;

  constructor(app: Express) {
    this.app = app;
    this.healthRoutes = new HealthRoutes(app);
  }

  public setupRoutes(): void {
    this.healthRoutes.initRoutes();
  }
}
