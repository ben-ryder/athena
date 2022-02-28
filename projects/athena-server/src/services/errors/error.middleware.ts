import { NextFunction, Request, Response } from 'express';
import ErrorHandler from './error-handler';

/**
 * Error Middleware
 * A middleware to return a 500 response if an error is thrown.
 */
async function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  await ErrorHandler.handleError(err, res);
}

export {
  errorMiddleware
}
