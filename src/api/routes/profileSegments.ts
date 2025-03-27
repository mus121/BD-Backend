import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { ProfileSegmentController } from '../controllers/profileSegment';

const router = Router();
const controller = new ProfileSegmentController();

router.post('/segments', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await controller.saveSegment(req.body);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

export default router;
