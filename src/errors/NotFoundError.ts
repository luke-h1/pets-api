import ApiError from './ApiError';

export default class NotFoundError extends ApiError {
  constructor(err?: { title?: string; code?: ApiError['code'] }) {
    super({
      title: err?.title ?? 'The requested resource could not be found.',
      type: 'Not Found',
      status: 404,
      code: err?.code ?? 'NotFound',
    });
  }
}
