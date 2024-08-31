import ForbiddenError from '@api/errors/ForbiddenError';
import {
  ACCESS_TOKEN_COOKIE,
  checkToken,
  sendAuthTokens,
} from '@api/utils/createAuthTokens';
import { NextFunction, Request, Response } from 'express';

const isAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE] as string;

    if (!accessToken) {
      throw new ForbiddenError();
    }

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

    req.userId = result.userId;

    sendAuthTokens(res, result.user);

    next();
  };
};
export default isAuth;
