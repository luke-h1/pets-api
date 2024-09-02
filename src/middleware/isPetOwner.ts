/* eslint-disable no-console */
import { db } from '@api/db/prisma';
import { petErrorCodes } from '@api/errors/pet';
import logger from '@api/utils/logger';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware to validate if the user is the owner of the pet
 */
const isPetOwner = () => {
  // eslint-disable-next-line consistent-return, @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line consistent-return
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.session.userId) {
        console.error('no session found');
        return res.status(400).json({ msg: 'unauthorized' });
      }

      const pet = await db.pet.findUnique({
        where: {
          id: req.params.id,
        },
      });

      if (!pet) {
        return res.status(404).json({
          code: 'PetNotFound',
          message: 'Pet not found. Please check your query and try again',
          statusCode: 404,
          title: 'pet not found',
        });
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
      next();
    } catch (error) {
      console.warn(
        'isPetOwner exception caught',
        JSON.stringify(error, null, 2),
      );
      // eslint-disable-next-line consistent-return, no-useless-return
      return;
    }
  };
};
export default isPetOwner;
