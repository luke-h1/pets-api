import { db } from '@api/db/prisma';
import ForbiddenError from '@api/errors/ForbiddenError';
import { ACCESS_TOKEN_COOKIE, checkToken } from '@api/utils/createAuthTokens';
import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const isRole = <TRole extends Role>(role: TRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE] as string;
    const result = await checkToken(accessToken);

    if (!result) {
      throw new ForbiddenError({
        title: 'You are not authorized to perform this action',
        code: 'forbidden',
        message: 'You are not authorized to perform this action',
        statusCode: 401,
      });
    }

    if (!result.userId || !result.user) {
      throw new ForbiddenError({
        title: 'You are not authorized to perform this action',
        code: 'forbidden',
        message: 'You are not authorized to perform this action',
        statusCode: 401,
      });
    }

    const user = await db.user.findFirst({
      where: {
        id: result.userId,
      },
    });

    if (!user) {
      throw new ForbiddenError({
        message: 'You are not authorized to perform this action',
        code: 'Forbidden',
        statusCode: 401,
        title: 'Forbidden',
        errors: [],
      });
    }

    if (user.role !== role) {
      throw new ForbiddenError({
        message: 'You are not authorized to perform this action',
        code: 'Forbidden',
        statusCode: 401,
        title: 'Forbidden',
        errors: [],
      });
    }

    next();
  };
};
export default isRole;
