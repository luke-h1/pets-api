import { Express } from 'express';
import HealthRoutes from './health';
import PetRoutes from './health/pet';

export default class Routes {
  private readonly app: Express;

  private readonly healthRoutes: HealthRoutes;

  private readonly petRoutes: PetRoutes;

  constructor(app: Express) {
    this.app = app;
    this.healthRoutes = new HealthRoutes(app);
    this.petRoutes = new PetRoutes(app);
  }

  public setupRoutes(): void {
    this.healthRoutes.initRoutes();
    this.petRoutes.initRoutes();
  }
}
