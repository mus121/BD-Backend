import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { ProfileSegmentController } from '../controllers/profileSegment';
import { HttpStatusCode } from '../../utils/bdError';

const router = Router();
const controller = new ProfileSegmentController();

router.post('/segments', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user.id;
    const response = await controller.saveSegment(req.body, userId);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

router.get('/labels', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user.id;

    if (!userId) {
      return res.status(HttpStatusCode.BadRequest).json({
        error: 'userId is required and must be a number',
      });
    }

    const response = await controller.getProfileLabels(userId);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

export default router;
