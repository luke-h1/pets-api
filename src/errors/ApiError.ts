type ErrorCode =
  | 'PetNotFound'
  | 'NoPetsFound'
  | 'InternalServerError'
  | 'NotFound'
  | 'BadRequest';

interface ApiErrorOptions {
  title: string;
  status: number;
  type: string;
  code: ErrorCode;
  stack?: string;
}

export default class ApiError extends Error implements ApiErrorOptions {
  public title: string;

  public status: number;

  public type: string;

  public code: ErrorCode;

  public stack?: string;

  constructor({ title, status, type, code, stack }: ApiErrorOptions) {
    super(title);
    this.title = title;
    this.status = status;
    this.type = type;
    this.code = code;
    this.stack = stack;
  }
}
