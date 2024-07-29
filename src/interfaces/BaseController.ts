import { Request, Response } from 'express';

export interface BaseController {
  getAll(req: Request, res: Response): void;
  getById(req: Request, res: Response): void;
  create(req: Request, res: Response): void;
  update(req: Request, res: Response): void;
  delete(req: Request, res: Response): void;
}
