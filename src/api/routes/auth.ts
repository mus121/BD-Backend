import {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from 'express';
import { AuthController } from '../controllers/auth';
import { BD_CONFIG } from '../../constants';

const router = Router();
const controller = new AuthController();

router.get('/google/login', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await controller.googleLogin();
    return res.redirect(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

router.get('/google/callback', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await controller.googleCallback(req, res);

    if (!res.headersSent) {
      res.redirect(BD_CONFIG.homePage ?? '/');
    }
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

export default router;
