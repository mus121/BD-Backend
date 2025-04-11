import {
  Request,
  Response,
  RequestHandler,
  Router,
  NextFunction,
} from 'express';
import { AiProfileController } from '../controllers/aiService';

const router = Router();
const controller = new AiProfileController();

router.post('/lables', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await controller.getProfileSegments(req.body);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

router.post('/getProfiles', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user.id;
    const response = await controller.getProfilesByEsId(req.body, userId);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

router.post('/followProfile', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user.id;
    const response = await controller.followProfile(req.body, userId);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

router.get('/getFollowProfile', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.user.id;
    const response = await controller.getFollowProfile(userId);
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

export default router;
