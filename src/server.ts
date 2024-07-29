import 'express-async-errors';
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import NotFoundError from './errors/NotFoundError';
import errorHandler from './errors/errorHandler';
import Routes from './routes';

class CreateServer {
  private readonly app: Express;

  private readonly routes: Routes;

  constructor() {
    this.app = express();
    this.routes = new Routes(this.app);
  }

  private handleNotFound() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.all('*', (_req, _res) => {
      throw new NotFoundError();
    });
  }

  public init(): Express {
    this.app.set('trust-proxy', 1);
    this.app.disable('x-powered-by');
    this.app.use(cors());
    this.app.use(express.json());
    this.app.set('json spaces', 2);
    this.app.use(compression());
    this.routes.setupRoutes();
    this.handleNotFound();

    this.app.use(errorHandler);

    return this.app;
  }
}
export default new CreateServer();
