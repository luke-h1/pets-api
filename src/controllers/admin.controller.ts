import { Request, Response } from 'express';
import AdminService from '../services/admin.service';

export default class AdminController {
  private readonly adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async flushRedis(req: Request, res: Response) {
    const result = await this.adminService.flush();

    if (result === 'ERROR') {
      return res.status(500).json({ message: 'Failed to flush redis' });
    }
    return res.status(200).json({ result: 'OK' });
  }
}
