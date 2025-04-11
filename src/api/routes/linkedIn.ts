import {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from 'express';
import { LinkedInController } from '../controllers/linkedIn';
import { validateRequest } from '../middleware/validation';
import { liProfileSchema } from '../../validators/linkedin';
import { HttpStatusCode } from '../../utils/bdError';

const router = Router();
const controller = new LinkedInController();

router.post('/profile', validateRequest(liProfileSchema), (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user.id;
    const response = controller.saveProfile(req.body, userId);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

router.post('/follow', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user.id;
    const response = await controller.connectProfile(req.body, userId);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

router.get('/connection', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user.id;
    if (!userId) {
      res.status(HttpStatusCode.BadRequest).json({
        error: 'userId is required and must be a number',
      });
      return;
    }
    const response = await controller.getConnectedProfiles(userId);
    res.send(response);
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

export default router;
