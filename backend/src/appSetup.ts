import express from 'express';
import NodeCache from 'node-cache';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import { RegisterRoutes } from './routes/routes';
import db from './v1/product/model';
import { loggerMiddleware } from './middleware/logger.middleware';
import injectCacheMiddleware from './middleware/injectCache.middleware';
import errorHandlerMiddleware from './middleware/errorHandler.middleware';
import * as swaggerDocument from './routes/swagger.json';
import { __DEV__ } from '.';

const getApp = async (cache?: NodeCache) => {
  const app = express();
  app.use(helmet());
  app.use(cors());

  app.use(express.json());
  app.use(injectCacheMiddleware(cache));

  //TODO - integrate swagger-jsdoc
  const swaggerMiddleware = [swaggerUi.serve, swaggerUi.setup(swaggerDocument)];

  //@ts-ignore
  // NOTE: purposefully ignored this
  app.use('/docs', ...swaggerMiddleware);

  try {
    await db.sequelize.authenticate();
    __DEV__ && console.log('DB connected');
  } catch (err) {
    __DEV__ && console.error('Unable to connect to the DB:', err);
    // NOTE: intentionally exit process if DB is not connected
    process.exit(1);
  }

  if (__DEV__) app.use(loggerMiddleware);
  RegisterRoutes(app);

  app.use(errorHandlerMiddleware);

  return app;
};

export default getApp;
