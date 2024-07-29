import ApiError from './ApiError';

export default class InternalServerError extends ApiError {
  constructor(err?: { title?: string; stack?: string }) {
    super({
      title:
        err?.title ?? 'An unexpected error occurred. Please try again later',
      type: 'Internal Server Error',
      status: 500,
      code: 'InternalServerError',
      stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
    });
  }
}
