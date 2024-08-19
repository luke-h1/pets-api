import { Express } from 'express';
import AuthRoutes from './auth.route';
import HealthRoutes from './health.route';
import ImageRoutes from './image.route';
import PetRoutes from './pet.route';
import VersionRoutes from './version.route';

export default class Routes {
  private readonly app: Express;

  private readonly healthRoutes: HealthRoutes;

  private readonly petRoutes: PetRoutes;

  private readonly authRoutes: AuthRoutes;

  private readonly versionRoutes: VersionRoutes;

  private readonly imageRoutes: ImageRoutes;

  constructor(app: Express) {
    this.app = app;
    this.healthRoutes = new HealthRoutes(app);
    this.petRoutes = new PetRoutes(app);
    this.authRoutes = new AuthRoutes(app);
    this.versionRoutes = new VersionRoutes(app);
    this.imageRoutes = new ImageRoutes(app);
  }

  public setupRoutes(): void {
    this.healthRoutes.initRoutes();
    this.versionRoutes.initRoutes();
    this.petRoutes.initRoutes();
    this.authRoutes.initRoutes();
    this.imageRoutes.initRoutes();
  }
}
