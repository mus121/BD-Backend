import { Request, Response, NextFunction } from 'express';
import errorMiddleware from './error';
import { BDError } from '../../utils/bdError';

export const responseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { send, json } = res;

    Object.defineProperty(res, 'send', {
      value: function newSend(obj: unknown) {
        if (res?.locals?.user) {
          const newResp = { response: obj };
          return send.call(this, JSON.stringify(newResp));
        }
        return send.call(this, obj);
      },
    });

    Object.defineProperty(res, 'json', {
      value: function newJson(obj: unknown) {
        if (res?.locals?.user) {
          const newResp = { response: obj };
          return json.call(this, JSON.stringify(newResp));
        }
        return json.call(this, obj);
      },
    });

    return next();
  } catch (error) {
    return errorMiddleware(error as BDError, req, res);
  }
};
