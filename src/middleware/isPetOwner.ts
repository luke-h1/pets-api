/**
 * Middleware to validate if the user is the owner of the pet
 */

import { Pet } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { db } from '../db/prisma';
import NotFoundError from '../errors/NotFoundError';
import logger from '../utils/logger';

const isPetOwner = (pet: Pet, userId: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const p = await db.pet.findFirst({
        where: {
          id: pet.id,
        },
      });

      if (!p) {
        throw new NotFoundError({
          message: 'Pet not found',
          code: 'not_found',
          statusCode: 404,
          title: 'Pet not found',
          errors: [],
        });
      }

      if (p.creatorId !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'You are not authorized to perform this action',
          errors: [],
        });
      }

      logger.info('[isPetOwner] User is the owner of the pet');
      next();
      // eslint-disable-next-line consistent-return, no-useless-return
      return;
    } catch (e) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to perform this action',
        errors: [],
      });
    }
  };
};
export default isPetOwner;
