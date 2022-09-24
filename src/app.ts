import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import path from 'path';

import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

class App {
  public app: express.Application;
  public port = process.env.PORT || 3000;

  constructor(controllers: readonly Controller[]) {
    this.app = express();

    this.initializeStandardMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen(): void {
    this.app.listen(Number(this.port), () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  public getServer(): express.Application {
    return this.app;
  }

  private initializeStandardMiddlewares() {
    this.app.set('trust proxy', true);
    this.app.use(bodyParser.json());
    this.app.use(express.urlencoded({
      extended: true
    }))

    this.app.use(cookieParser());
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );
    this.app.use('/files', express.static(path.join(__dirname, 'files')))
  }

  private initializeControllers(controllers: readonly Controller[]) {
    this.app.use('/checks', (_, response) => response.send());
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });

    // Error Handling
    this.app.use(errorMiddleware);

  }
}

export default App;
