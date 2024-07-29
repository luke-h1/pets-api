import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, z } from 'zod';
import logger from '../utils/logger';

/**
 * Middleware to validate a request body, query, and params against a {@param schema} Zod schema
 */
const validateResource = (schema: AnyZodObject) => {
  // eslint-disable-next-line consistent-return
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e) {
      logger.warn('validation exception caught', JSON.stringify(e));

      if (e instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: e.errors,
        });
      }
      next();
    }
  };
};
export default validateResource;
