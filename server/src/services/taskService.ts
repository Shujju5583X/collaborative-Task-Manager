import { taskRepository, TaskQueryFilters } from '../repositories/taskRepository';
import { userRepository } from '../repositories/userRepository';
import { ITaskWithRelations, ICreateTaskInput, IUpdateTaskInput, Status } from '../types';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';

export const taskService = {
    async getTasks(filters: TaskQueryFilters, userId: string): Promise<ITaskWithRelations[]> {
        const queryFilters: TaskQueryFilters = { ...filters };

        if (filters.assignedToId === 'me') {
            queryFilters.assignedToId = userId;
        }

        if (filters.createdById === 'me') {
            queryFilters.createdById = userId;
        }

        return taskRepository.findMany(queryFilters);
    },

    async getTaskById(id: string): Promise<ITaskWithRelations> {
        const task = await taskRepository.findById(id);
        if (!task) {
            throw new NotFoundError('Task not found');
        }
        return task;
    },

    async getMyTasks(userId: string): Promise<ITaskWithRelations[]> {
        return taskRepository.findByAssignee(userId);
    },

    async getCreatedByMe(userId: string): Promise<ITaskWithRelations[]> {
        return taskRepository.findByCreator(userId);
    },

    async getOverdueTasks(): Promise<ITaskWithRelations[]> {
        return taskRepository.findOverdue();
    },

    async createTask(input: ICreateTaskInput, createdById: string): Promise<ITaskWithRelations> {
        // Validate assignee exists if provided
        if (input.assignedToId) {
            const assignee = await userRepository.findByIdPublic(input.assignedToId);
            if (!assignee) {
                throw new BadRequestError('Assigned user not found');
            }
        }

        return taskRepository.create({
            ...input,
            createdById,
        });
    },

    async updateTask(
        id: string,
        input: IUpdateTaskInput,
        userId: string
    ): Promise<{ task: ITaskWithRelations; previousAssigneeId: string | null; newAssigneeId: string | null }> {
        const existingTask = await taskRepository.findById(id);
        if (!existingTask) {
            throw new NotFoundError('Task not found');
        }

        // Only creator or assignee can update
        if (existingTask.createdById !== userId && existingTask.assignedToId !== userId) {
            throw new ForbiddenError('You do not have permission to update this task');
        }

        // Validate new assignee if provided
        if (input.assignedToId && input.assignedToId !== existingTask.assignedToId) {
            const assignee = await userRepository.findByIdPublic(input.assignedToId);
            if (!assignee) {
                throw new BadRequestError('Assigned user not found');
            }
        }

        const previousAssigneeId = existingTask.assignedToId;
        const task = await taskRepository.update(id, input);
        const newAssigneeId = input.assignedToId !== undefined ? input.assignedToId : existingTask.assignedToId;

        return {
            task,
            previousAssigneeId,
            newAssigneeId: newAssigneeId !== previousAssigneeId ? newAssigneeId : null,
        };
    },

    async deleteTask(id: string, userId: string): Promise<void> {
        const existingTask = await taskRepository.findById(id);
        if (!existingTask) {
            throw new NotFoundError('Task not found');
        }

        // Only creator can delete
        if (existingTask.createdById !== userId) {
            throw new ForbiddenError('You do not have permission to delete this task');
        }

        await taskRepository.delete(id);
    },

    async assignTask(
        taskId: string,
        assignedToId: string | null,
        userId: string
    ): Promise<{ task: ITaskWithRelations; previousAssigneeId: string | null }> {
        const existingTask = await taskRepository.findById(taskId);
        if (!existingTask) {
            throw new NotFoundError('Task not found');
        }

        // Only creator can assign
        if (existingTask.createdById !== userId) {
            throw new ForbiddenError('Only the task creator can assign users');
        }

        // Validate new assignee if provided
        if (assignedToId) {
            const assignee = await userRepository.findByIdPublic(assignedToId);
            if (!assignee) {
                throw new BadRequestError('Assigned user not found');
            }
        }

        const previousAssigneeId = existingTask.assignedToId;
        const task = await taskRepository.update(taskId, { assignedToId });

        return { task, previousAssigneeId };
    },

    async updateTaskStatus(
        taskId: string,
        status: Status,
        userId: string
    ): Promise<ITaskWithRelations> {
        const existingTask = await taskRepository.findById(taskId);
        if (!existingTask) {
            throw new NotFoundError('Task not found');
        }

        // Only creator or assignee can update status
        if (existingTask.createdById !== userId && existingTask.assignedToId !== userId) {
            throw new ForbiddenError('You do not have permission to update this task');
        }

        return taskRepository.update(taskId, { status });
    },
};
