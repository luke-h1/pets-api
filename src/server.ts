import 'reflect-metadata';
import 'express-async-errors';
import compression from 'compression';
import connectRedis from 'connect-redis';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import session from 'express-session';
import RedisDatabase from './db/redis';
import NotFoundError from './errors/NotFoundError';
import errorHandler from './errors/errorHandler';
import Routes from './routes';
import testRedis from './test/redis';
import logger from './utils/logger';

dotenv.config();

class CreateServer {
  private readonly app: Express;

  private readonly routes: Routes;

  private readonly redisDb: typeof RedisDatabase;

  constructor() {
    this.app = express();
    this.routes = new Routes(this.app);
    this.redisDb = RedisDatabase;
  }

  private isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  private handleNotFound() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.all('*', (_req, _res) => {
      throw new NotFoundError();
    });
  }

  public init() {
    // *order is important*

    // middleware
    this.app.set('trust-proxy', 1);
    this.app.disable('x-powered-by');
    this.app.set('json spaces', 2);
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(compression());

    const RedisStore = connectRedis(session);

    // session middleware
    this.app.use(
      session({
        store: new RedisStore({
          // hack to get around issues in unit tests
          client:
            process.env.NODE_ENV === 'test'
              ? testRedis
              : this.redisDb.getInstance(),
          disableTouch: true,
          prefix: 'sess:',
          db: 1,
          logErrors(error) {
            logger.error(`redis session error: ${error}`);
          },
        }),
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: this.isProduction(),
          httpOnly: true, // prevent client side js from reading the cookie
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          domain: this.isProduction() ? 'deployed_domain' : undefined,
          path: '/',
          signed: this.isProduction(),
          sameSite: 'lax',
        },
      }),
    );

    // routing
    this.routes.setupRoutes();

    // global 404
    this.handleNotFound();

    // global error handler
    this.app.use(errorHandler);

    return this.app;
  }
}
export default new CreateServer();
