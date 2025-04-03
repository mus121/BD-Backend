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
    const response = await controller.getProfilesByEsId(req.body);
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
  console.log('Request body:', req.body);
  try {
    const response = await controller.followProfile(req.body);
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
    const response = await controller.getFollowProfile();
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

export default router;
