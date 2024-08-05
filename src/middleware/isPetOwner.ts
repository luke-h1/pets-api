import { NextFunction, Request, Response } from 'express';
import { db } from '../db/prisma';
import { petErrorCodes } from '../errors/pet';
import logger from '../utils/logger';

/**
 * Middleware to validate if the user is the owner of the pet
 */
const isPetOwner = <TRequest extends Request>() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line consistent-return
  return async (req: TRequest, res: Response, next: NextFunction) => {
    try {
      const pet = await db.pet.findFirst({
        where: {
          id: req.params.id,
        },
      });

      if (!pet) {
        return false;
      }

      if (pet.creatorId !== req.session.userId) {
        logger.info(
          `${petErrorCodes.PetUpdateNotAuthorised} triggered. User ${req.session.userId} is not authorised to perform operations on ${pet.id}`,
        );

        return res.status(401).json({
          code: 'forbidden',
          message: 'You are not authorized to perform this action',
          statusCode: 401,
          title: 'You are not authorized to perform this action',
          type: 'Forbidden',
          errors: [],
        });
      }

      logger.info('[isPetOwner]: validation passed');
      next();
    } catch (error) {
      logger.warn('isPetOwner exception caught', error);
    }
  };
};
export default isPetOwner;
