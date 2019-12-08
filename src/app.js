import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import {
  DB_PATH,
  PORT,
  SESSION_SECRET,
  SESSION_NAME,
  SESSION_MAX_AGE,
} from './env';
import { routes } from './routes';
import { errorHandler, requestLogger } from './utils';
import { User } from './models';

const connectionOptions = {
  type: 'sqlite',
  database: DB_PATH,
  entities: [User],
  synchronize: true,
  logging: true,
};

createConnection(connectionOptions).then(async connection => {
  const app = express();
  app.use(
    session({
      secret: SESSION_SECRET,
      name: SESSION_NAME,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: SESSION_MAX_AGE,
        sameSite: true,
        sexure: false,
      },
    }),
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(requestLogger());
  app.use(routes);
  app.use(errorHandler());
  app.listen(PORT);
  console.log(`Server is running at ${PORT}`);
});
