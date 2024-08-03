import { Env } from '../util/env';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export {};
