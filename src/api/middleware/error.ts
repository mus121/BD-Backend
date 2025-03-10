import { Request, Response } from 'express';
import { BDError } from '../../utils/bdError';

/**
 * Express middleware to handle errors.
 * @param err - The error object to handle.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param _next - The next middleware function.
 */
const errorMiddleware = (err: BDError, req: Request, res: Response): void => {
  try {
    console.log('Middleware Error Handling', err);
    const httpCode = err.httpCode || 500;
    const httpError = err.httpError || 'Internal Server Error';

    const customErrorCode =
      process.env.NODE_ENV !== 'production' ? err.errorCode : '';

    const customError =
      process.env.NODE_ENV !== 'production' ? err.errorMessage : '';

    const message =
      process.env.NODE_ENV !== 'production'
        ? err.message
        : 'Something went wrong';

    const errorStack = process.env.NODE_ENV !== 'production' ? err.stack : {};

    res.status(httpCode).send({
      success: false,
      stack: errorStack,
      message: `${customErrorCode || ''} ${customError || ''} ${
        message || ''
      }`.trim(),
      httpCode,
      httpError,
    });
  } catch (error) {
    console.log('error while error handling lmao');
    throw error;
  }
};

export default errorMiddleware;
