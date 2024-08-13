import 'reflect-metadata';
import 'express-async-errors';
import bodyParser from 'body-parser';
import compression from 'compression';
import connectRedis from 'connect-redis';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import RedisDatabase from './db/redis';
import openApiSpec from './docs/swagger';
import NotFoundError from './errors/NotFoundError';
import errorHandler from './errors/errorHandler';
import Routes from './routes';
import testRedis from './test/redis';
import logger from './utils/logger';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.development',
});

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
    this.app.enable('trust proxy');
    this.app.disable('x-powered-by');
    this.app.set('json spaces', 2);
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(compression());

    const RedisStore = connectRedis(session);

    // session authentication middleware
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
          logErrors(error) {
            logger.error(`redis session error: ${error}`);
          },
        }),
        secret: process.env.SESSION_SECRET ?? 'pets',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: this.isProduction(),
          httpOnly: true, // prevent client side js from reading the cookie
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          domain: this.isProduction() ? process.env.API_BASE_URL : undefined,
          path: '/',
          signed: this.isProduction(),
          sameSite: 'lax',
        },
      }),
    );

    // routing
    this.routes.setupRoutes();

    this.app.use(
      '/docs',
      swaggerUi.serve,
      swaggerUi.setup(openApiSpec(), {
        swaggerUrl: '/docs',
      }),
    );

    // global 404
    this.handleNotFound();

    // global error handler
    this.app.use(errorHandler);

    return this.app;
  }
}
export default new CreateServer();
