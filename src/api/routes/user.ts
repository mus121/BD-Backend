import {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from 'express';
import { UserController } from '../controllers/user';
import { BDError, ErrorCode, HttpStatusCode } from '../../utils/bdError';

const router = Router();
const controller = new UserController();

router.get('/user', (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = res.locals;
    if (!userId) {
      throw new BDError(
        'User ID is missing',
        HttpStatusCode.BadRequest,
        ErrorCode.ControllerError,
      );
    }

    const user = await controller.getUserById(userId);

    if (!user) {
      throw new BDError(
        'User not found',
        HttpStatusCode.NotFound,
        ErrorCode.ControllerError,
      );
    }

    return res.status(HttpStatusCode.Ok).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

export default router;
