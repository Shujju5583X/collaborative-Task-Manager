import { Router } from 'express';
import { taskController } from '../controllers';
import { authMiddleware, validate } from '../middlewares';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../utils/validation';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// Task list routes
router.get('/', taskController.getTasks);
router.get('/my-tasks', taskController.getMyTasks);
router.get('/created-by-me', taskController.getCreatedByMe);
router.get('/overdue', taskController.getOverdue);

// Task CRUD routes
router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/:id', validate(taskIdSchema, 'params'), taskController.getTaskById);
router.patch('/:id', validate(taskIdSchema, 'params'), validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', validate(taskIdSchema, 'params'), taskController.deleteTask);

// Task status update
router.patch('/:id/status', validate(taskIdSchema, 'params'), taskController.updateTaskStatus);

export default router;
