import { ErrorRequestHandler } from 'express';
import logger from '../utils/logger';
import ApiError from './ApiError';
import InternalServerError from './InternalServerError';
import NotFoundError from './NotFoundError';

const errorHandler: ErrorRequestHandler<{}, ApiError | string> = (
  err,
  req,
  res,
  _,
) => {
  // eslint-disable-next-line no-shadow
  const handleApiError = (err: unknown) => {
    if (err instanceof ApiError) {
      return err;
    }

    if (err instanceof NotFoundError) {
      return new ApiError({
        title: 'The requested resource could not be found.',
        status: 404,
        type: 'Not Found',
        code: 'NotFound',
      });
    }

    logger.error('An unexpected error occurred:', err);

    return new InternalServerError();
  };

  const apiError = handleApiError(err);

  res.status(apiError.status).send(apiError).end();
};
export default errorHandler;
