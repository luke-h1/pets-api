import { Request, Response } from 'express';

export default class HealthController {
  public health(_req: Request, res: Response) {
    return res.status(200).json({ status: 'ok' });
  }
}
