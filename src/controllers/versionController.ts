import { Request, Response } from 'express';
import VersionService from '../services/versionService';

export default class VersionController {
  private readonly versionService: VersionService;

  constructor() {
    this.versionService = new VersionService();
  }

  async getVersion(req: Request, res: Response) {
    const version = this.versionService.getVersion(req);

    if (req.accepts('xml')) {
      return res.status(200).send(version);
    }
    return res.status(200).json(version);
  }
}
