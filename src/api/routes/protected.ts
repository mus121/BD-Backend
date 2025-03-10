import { Router } from 'express';
import userRouter from './user';
import linkedInProfileRouter from './linkedIn';

const router = Router();
router.use('/linkedin', linkedInProfileRouter);
router.use('/me', userRouter);

export default router;
