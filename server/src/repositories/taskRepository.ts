import prisma from '../utils/prisma';
import { ITask, ITaskWithRelations, ICreateTaskInput, IUpdateTaskInput, Status } from '../types';
import { Prisma } from '@prisma/client';

const includeRelations = {
    createdBy: {
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    },
    assignedTo: {
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
        },
    },
};

export interface TaskQueryFilters {
    status?: Status;
    priority?: string;
    assignedToId?: string;
    createdById?: string;
    overdue?: boolean;
}

export const taskRepository = {
    async findById(id: string): Promise<ITaskWithRelations | null> {
        return prisma.task.findUnique({
            where: { id },
            include: includeRelations,
        }) as Promise<ITaskWithRelations | null>;
    },

    async findMany(filters: TaskQueryFilters): Promise<ITaskWithRelations[]> {
        const where: Prisma.TaskWhereInput = {};

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.priority) {
            where.priority = filters.priority as Prisma.EnumPriorityFilter['equals'];
        }

        if (filters.assignedToId) {
            where.assignedToId = filters.assignedToId;
        }

        if (filters.createdById) {
            where.createdById = filters.createdById;
        }

        if (filters.overdue) {
            where.dueDate = {
                lt: new Date(),
            };
            where.status = {
                not: Status.COMPLETED,
            };
        }

        return prisma.task.findMany({
            where,
            include: includeRelations,
            orderBy: [
                { priority: 'desc' },
                { dueDate: 'asc' },
                { createdAt: 'desc' },
            ],
        }) as Promise<ITaskWithRelations[]>;
    },

    async create(data: ICreateTaskInput & { createdById: string }): Promise<ITaskWithRelations> {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                priority: data.priority,
                dueDate: data.dueDate,
                createdById: data.createdById,
                assignedToId: data.assignedToId,
            },
            include: includeRelations,
        }) as Promise<ITaskWithRelations>;
    },

    async update(id: string, data: IUpdateTaskInput): Promise<ITaskWithRelations> {
        return prisma.task.update({
            where: { id },
            data,
            include: includeRelations,
        }) as Promise<ITaskWithRelations>;
    },

    async delete(id: string): Promise<ITask> {
        return prisma.task.delete({
            where: { id },
        });
    },

    async findByCreator(createdById: string): Promise<ITaskWithRelations[]> {
        return prisma.task.findMany({
            where: { createdById },
            include: includeRelations,
            orderBy: { createdAt: 'desc' },
        }) as Promise<ITaskWithRelations[]>;
    },

    async findByAssignee(assignedToId: string): Promise<ITaskWithRelations[]> {
        return prisma.task.findMany({
            where: { assignedToId },
            include: includeRelations,
            orderBy: { createdAt: 'desc' },
        }) as Promise<ITaskWithRelations[]>;
    },

    async findOverdue(): Promise<ITaskWithRelations[]> {
        return prisma.task.findMany({
            where: {
                dueDate: {
                    lt: new Date(),
                },
                status: {
                    not: Status.COMPLETED,
                },
            },
            include: includeRelations,
            orderBy: { dueDate: 'asc' },
        }) as Promise<ITaskWithRelations[]>;
    },
};
