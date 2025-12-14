import { z } from 'zod';
import { Status, Priority } from '@prisma/client';

// ==================== Auth Schemas ====================
export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

// ==================== Task Schemas ====================
export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().max(2000, 'Description too long').optional(),
    priority: z.nativeEnum(Priority).optional(),
    dueDate: z.string().datetime().optional().transform((val) => val ? new Date(val) : undefined),
    assignedToId: z.string().uuid('Invalid user ID').optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    description: z.string().max(2000, 'Description too long').nullable().optional(),
    status: z.nativeEnum(Status).optional(),
    priority: z.nativeEnum(Priority).optional(),
    dueDate: z.string().datetime().nullable().optional().transform((val) => val ? new Date(val) : val),
    assignedToId: z.string().uuid('Invalid user ID').nullable().optional(),
});

export const taskIdSchema = z.object({
    id: z.string().uuid('Invalid task ID'),
});

// ==================== Query Schemas ====================
export const taskQuerySchema = z.object({
    status: z.nativeEnum(Status).optional(),
    priority: z.nativeEnum(Priority).optional(),
    assignedToMe: z.string().transform(val => val === 'true').optional(),
    createdByMe: z.string().transform(val => val === 'true').optional(),
    overdue: z.string().transform(val => val === 'true').optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQuery = z.infer<typeof taskQuerySchema>;
