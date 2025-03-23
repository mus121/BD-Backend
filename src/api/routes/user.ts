import {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from 'express';

const router = Router();
// const controller = new UserController();

// router.get('/me', (async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email: userId } = res.locals.user;

//     if (!userId) {
//       throw new BDError(
//         'User ID is missing',
//         HttpStatusCode.BadRequest,
//         ErrorCode.ControllerError,
//       );
//     }

//     const user = await controller.getUserById(userId);

//     if (!user) {
//       throw new BDError(
//         'User not found',
//         HttpStatusCode.NotFound,
//         ErrorCode.ControllerError,
//       );
//     }

//     return res.status(HttpStatusCode.Ok).send({ success: true, data: user });
//   } catch (error) {
//     return next(error);
//   }
// }) as RequestHandler);

router.get('/current', (async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.send({ user: res.locals.user });
  } catch (e) {
    console.log(e);
    return next(e);
  }
}) as RequestHandler);

export default router;
