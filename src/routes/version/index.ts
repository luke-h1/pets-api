import { Express } from 'express';
import VersionController from '../../controllers/versionController';

export default class VersionRoutes {
  private readonly app: Express;

  private readonly versionController: VersionController;

  constructor(app: Express) {
    this.app = app;
    this.versionController = new VersionController();
  }

  public initRoutes(): void {
    this.app.get('/api/version', (req, res) => {
      return this.versionController.getVersion(req, res);
    });
  }
}
