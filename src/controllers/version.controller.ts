import { Request, Response } from 'express';
import VersionService from '../services/version.service';

export default class VersionController {
  private readonly versionService: VersionService;

  constructor() {
    this.versionService = new VersionService();
  }

  async getVersion(req: Request, res: Response) {
    const version = this.versionService.getVersion();
    return res.status(200).json(version);
  }
}
