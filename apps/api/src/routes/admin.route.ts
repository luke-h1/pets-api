import { Role } from '@prisma/client';
import { Express } from 'express';
import AdminController from '../controllers/admin.controller';
import isRole from '../middleware/isRole';

export default class AdminRoutes {
  private readonly app: Express;

  private readonly adminController: AdminController;

  constructor(app: Express) {
    this.app = app;
    this.adminController = new AdminController();
  }

  public setupRoutes(): void {
    this.app.post('/api/admin/flush', isRole(Role.ADMIN), (req, res) => {
      return this.adminController.flushRedis(req, res);
    });
  }
}
