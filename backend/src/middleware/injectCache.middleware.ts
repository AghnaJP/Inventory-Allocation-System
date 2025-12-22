import { NextFunction, Response, Request } from 'express';

import NodeCache from 'node-cache';

// TODO - move to types
export interface IRequest extends Request {
  cache?: NodeCache;
}

/**
 * Middleware to inject a NodeCache instance into the request object.
 *
 * This is useful if you want to use an in-memory cache across different parts
 * of your application (e.g., to store temporary data like rate limits, responses, etc.).
 *
 * @param cache - An optional instance of NodeCache to inject.
 * @returns An Express middleware function that adds cache to req.
 *
 * @example
 * ts
 * import express from 'express';
 * import NodeCache from 'node-cache';
 * import injectCacheMiddleware from './middlewares/injectCache';
 *
 * const app = express();
 * const cache = new NodeCache();
 *
 * app.use(injectCacheMiddleware(cache));
 *
 */
const injectCacheMiddleware =
  (cache?: NodeCache) =>
  (req: IRequest, _: Response, next: NextFunction): void => {
    req.cache = cache;
    next();
  };

export default injectCacheMiddleware;
