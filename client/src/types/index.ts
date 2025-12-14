// ==================== Enums ====================
export enum Status {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

// ==================== User Types ====================
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

// ==================== Task Types ====================
export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: Status;
    priority: Priority;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    createdById: string;
    assignedToId: string | null;
    createdBy: User;
    assignedTo: User | null;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    priority?: Priority;
    dueDate?: string;
    assignedToId?: string;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string | null;
    status?: Status;
    priority?: Priority;
    dueDate?: string | null;
    assignedToId?: string | null;
}

// ==================== Auth Types ====================
export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
    };
}

// ==================== API Response Types ====================
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: string[];
}

// ==================== Socket Event Types ====================
export interface TaskCreatedEvent {
    task: Task;
}

export interface TaskUpdatedEvent {
    task: Task;
}

export interface TaskDeletedEvent {
    taskId: string;
}

export interface AssignmentNotificationEvent {
    type: 'NEW_ASSIGNMENT' | 'UNASSIGNED' | 'TASK_DELETED';
    task: Task;
    message: string;
}
