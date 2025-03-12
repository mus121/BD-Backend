import {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from 'express';
import { AuthController } from '../controllers/auth';
import { BD_CONFIG } from '../../constants';
import { setCookies } from '../../utils/cookie';

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
    const authData = await controller.googleCallback(req.query);

    res.locals.authData = authData;

    if (!res.locals.authData) {
      return res.status(400).json({ message: 'Authentication data not found' });
    }

    setCookies(req, res);

    const redirectUrl = BD_CONFIG.allowedOrigin
      ? `${BD_CONFIG.allowedOrigin}/public/google/success?success=true`
      : '/';

    return res.redirect(redirectUrl);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

export default router;
