import dotenv from 'dotenv';
dotenv.config();

import NodeCache from 'node-cache';
import getApp from './appSetup';

const PORT = process.env.PORT || 3000;
export const __DEV__ = process.env.NODE_ENV !== 'production';

const runApp = async () => {
  const cache = new NodeCache();
  const app = getApp(cache);

  (await app).listen(PORT, () => {
    __DEV__ &&
      console.log({
        environment: process.env.NODE_ENV,
        liveness: true,
        readiness: true,
      });
  });

  return app;
};

export default runApp();
