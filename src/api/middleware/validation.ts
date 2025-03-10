import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validation Middleware for Zod
 *
 * @param schema
 * @returns Express middleware function
 */
export const validateRequest =
  (schema: {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
    headers?: ZodSchema;
  }) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schema.body) schema.body.parse(req.body);
      if (schema.params) schema.params.parse(req.params);
      if (schema.query) schema.query.parse(req.query);
      if (schema.headers) schema.headers.parse(req.headers);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Invalid request payload',
          details: error.errors.map((err) => err.message).join(', '),
        });
        return;
      }

      next(error);
    }
  };
