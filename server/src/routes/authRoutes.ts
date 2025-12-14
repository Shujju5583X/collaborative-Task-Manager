import { Router } from 'express';
import { authController } from '../controllers';
import { authMiddleware, validate } from '../middlewares';
import { registerSchema, loginSchema } from '../utils/validation';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authMiddleware, authController.me);
router.get('/users', authMiddleware, authController.getUsers);

export default router;
