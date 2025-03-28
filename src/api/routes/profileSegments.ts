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
    const response = await controller.saveSegment(req.body);
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
    const userId = req.query.userId as unknown as number;
    if (!userId) {
      res.status(HttpStatusCode.BadRequest).json({
        error: 'userId is required and must be a number',
      });
      return;
    }
    // const response = await controller.getProfileLabels(userId);
    return res.send({
      labels: [
        '"Executive Vice President Cloud and AI Leadership in Large Public Enterprises"',
        '"Executive Leadership in Cloud Computing and AI for Large Public Enterprises"',
        '"C-Suite and VP-Level Roles in IT Services with Digital Transformation Expertise"',
        '"Strategic Growth and Product Planning in Global Tech Hubs"',
        '"Leadership in Enterprise Software and Cloud Solutions"',
        '"Cross-Border Executive Management in Tech and IT Consulting"',
      ],
    });
  } catch (error) {
    return next(error);
  }
}) as RequestHandler);

export default router;
