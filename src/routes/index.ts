import { Router } from 'express';
import userRoutes from './userRoutes';
import newsRouter from './newsRoutes'
const router = Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/news',newsRouter)
export default router;
