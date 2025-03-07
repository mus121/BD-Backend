import {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from 'express';
import { AuthController } from '../controllers/auth';
import { HttpStatusCode } from '../../utils/bdError';
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
      return res.redirect(BD_CONFIG.homePage ?? '/');
    }
    // Explicit return to satisfy ESLint
  } catch (error) {
    next(error);
    // Ensure function always returns something
  }
}) as RequestHandler);

router.post('/logout', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await controller.logout(req, res);
    return res.status(HttpStatusCode.Ok).json({ message: 'Logout successful' });
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

export default router;
