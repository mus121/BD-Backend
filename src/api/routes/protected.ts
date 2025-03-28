import { Router } from 'express';
import userRouter from './user';
import linkedInProfileRouter from './linkedIn';
import aiServiceRouter from './aiService';
import profileSegmentRouter from './profileSegments';

const router = Router();
router.use('/linkedin', linkedInProfileRouter);
router.use('/user', userRouter);
router.use('/aiProfile', aiServiceRouter);
router.use('/profile', profileSegmentRouter);
export default router;
