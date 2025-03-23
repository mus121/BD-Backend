import { Router } from 'express';
import userRouter from './user';
import linkedInProfileRouter from './linkedIn';
import aiServiceRouter from './aiService';

const router = Router();
router.use('/linkedin', linkedInProfileRouter);
router.use('/user', userRouter);
router.use('/aiProfile', aiServiceRouter);
export default router;
