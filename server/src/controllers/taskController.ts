import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services';
import { Status } from '../types';
import { getIO } from '../socket';

export const taskController = {
    async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const { status, priority, assignedToMe, createdByMe, overdue } = req.query;

            const filters = {
                status: status as Status | undefined,
                priority: priority as string | undefined,
                assignedToId: assignedToMe === 'true' ? 'me' : undefined,
                createdById: createdByMe === 'true' ? 'me' : undefined,
                overdue: overdue === 'true',
            };

            const tasks = await taskService.getTasks(filters, userId);

            res.json({
                success: true,
                data: { tasks },
            });
        } catch (error) {
            next(error);
        }
    },

    async getMyTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const tasks = await taskService.getMyTasks(userId);

            res.json({
                success: true,
                data: { tasks },
            });
        } catch (error) {
            next(error);
        }
    },

    async getCreatedByMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const tasks = await taskService.getCreatedByMe(userId);

            res.json({
                success: true,
                data: { tasks },
            });
        } catch (error) {
            next(error);
        }
    },

    async getOverdue(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tasks = await taskService.getOverdueTasks();

            res.json({
                success: true,
                data: { tasks },
            });
        } catch (error) {
            next(error);
        }
    },

    async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const task = await taskService.getTaskById(id);

            res.json({
                success: true,
                data: { task },
            });
        } catch (error) {
            next(error);
        }
    },

    async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const task = await taskService.createTask(req.body, userId);

            // Emit socket event
            const io = getIO();
            io.emit('TASK_CREATED', { task });

            // Notify assignee if task is assigned
            if (task.assignedToId && task.assignedToId !== userId) {
                io.to(`user:${task.assignedToId}`).emit('ASSIGNMENT_NOTIFICATION', {
                    type: 'NEW_ASSIGNMENT',
                    task,
                    message: `You have been assigned to: ${task.title}`,
                });
            }

            res.status(201).json({
                success: true,
                data: { task },
            });
        } catch (error) {
            next(error);
        }
    },

    async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;
            const { task, previousAssigneeId, newAssigneeId } = await taskService.updateTask(
                id,
                req.body,
                userId
            );

            // Emit socket event
            const io = getIO();
            io.emit('TASK_UPDATED', { task });

            // Notify new assignee
            if (newAssigneeId && newAssigneeId !== userId) {
                io.to(`user:${newAssigneeId}`).emit('ASSIGNMENT_NOTIFICATION', {
                    type: 'NEW_ASSIGNMENT',
                    task,
                    message: `You have been assigned to: ${task.title}`,
                });
            }

            // Notify previous assignee of removal
            if (previousAssigneeId && previousAssigneeId !== newAssigneeId) {
                io.to(`user:${previousAssigneeId}`).emit('ASSIGNMENT_NOTIFICATION', {
                    type: 'UNASSIGNED',
                    task,
                    message: `You have been unassigned from: ${task.title}`,
                });
            }

            res.json({
                success: true,
                data: { task },
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            const task = await taskService.getTaskById(id);
            await taskService.deleteTask(id, userId);

            // Emit socket event
            const io = getIO();
            io.emit('TASK_DELETED', { taskId: id });

            // Notify assignee of deletion
            if (task.assignedToId && task.assignedToId !== userId) {
                io.to(`user:${task.assignedToId}`).emit('ASSIGNMENT_NOTIFICATION', {
                    type: 'TASK_DELETED',
                    task,
                    message: `Task deleted: ${task.title}`,
                });
            }

            res.json({
                success: true,
                message: 'Task deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    },

    async updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;
            const { status } = req.body;

            const task = await taskService.updateTaskStatus(id, status, userId);

            // Emit socket event
            const io = getIO();
            io.emit('TASK_UPDATED', { task });

            res.json({
                success: true,
                data: { task },
            });
        } catch (error) {
            next(error);
        }
    },
};
