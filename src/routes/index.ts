import { Express } from 'express';
import AuthRoutes from './auth';
import HealthRoutes from './health';
import PetRoutes from './pet';

export default class Routes {
  private readonly app: Express;

  private readonly healthRoutes: HealthRoutes;

  private readonly petRoutes: PetRoutes;

  private readonly authRoutes: AuthRoutes;

  constructor(app: Express) {
    this.app = app;
    this.healthRoutes = new HealthRoutes(app);
    this.petRoutes = new PetRoutes(app);
    this.authRoutes = new AuthRoutes(app);
  }

  public setupRoutes(): void {
    this.healthRoutes.initRoutes();
    this.petRoutes.initRoutes();
    this.authRoutes.initRoutes();
  }
}
