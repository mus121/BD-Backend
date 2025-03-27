import {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from 'express';

const router = Router();

router.get('/current', (async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.send({ user: res.locals.user });
  } catch (e) {
    console.log(e);
    return next(e);
  }
}) as RequestHandler);

export default router;
