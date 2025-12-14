import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';
import taskRoutes from './taskRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

// Health check
router.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
