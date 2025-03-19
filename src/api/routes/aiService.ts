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

router.get('/', (async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await controller.getAllProfiles();
    return res.send(response);
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

export default router;
