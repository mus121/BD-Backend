import {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from 'express';
import { LinkedInController } from '../controllers/linkedIn';
import { validateRequest } from '../middleware/validation';
import {
  getConnectedProfilesSchema,
  liProfileSchema,
} from '../../validators/linkedin';
import { HttpStatusCode } from '../../utils/bdError';

const router = Router();
const controller = new LinkedInController();

router.post('/profile', validateRequest(liProfileSchema), (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = controller.saveProfile(req.body);
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
    const response = await controller.connectProfile(req.body);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

router.get('/connection', validateRequest(getConnectedProfilesSchema), (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.query.userId as unknown as number;
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
