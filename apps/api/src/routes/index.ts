import { Express } from 'express';
import AdminRoutes from './admin.route';
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

  private readonly adminRoutes: AdminRoutes;

  constructor(app: Express) {
    this.app = app;
    this.healthRoutes = new HealthRoutes(app);
    this.petRoutes = new PetRoutes(app);
    this.authRoutes = new AuthRoutes(app);
    this.versionRoutes = new VersionRoutes(app);
    this.imageRoutes = new ImageRoutes(app);
    this.adminRoutes = new AdminRoutes(app);
  }

  public setupRoutes(): void {
    this.healthRoutes.setupRoutes();
    this.versionRoutes.setupRoutes();
    this.petRoutes.setupRoutes();
    this.authRoutes.setupRoutes();
    this.imageRoutes.setupRoutes();
    this.adminRoutes.setupRoutes();
  }
}
