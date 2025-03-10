import { Router } from 'express';
import publicRoutes from './public';
import protectedRoutes from './protected';
import { authMiddleware } from '../middleware/auth';
import { responseMiddleware } from '../middleware/response';
import errorMiddleware from '../middleware/error';

const router = Router();

router.use('/public', responseMiddleware, publicRoutes);
router.use('/private', authMiddleware, responseMiddleware, protectedRoutes);
router.use('*', errorMiddleware);

export default router;
