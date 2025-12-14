import { Status, Priority } from '@prisma/client';

// ==================== User Types ====================
export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPublic {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface ICreateUserInput {
  email: string;
  password: string;
  name: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

// ==================== Task Types ====================
export interface ITask {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  assignedToId: string | null;
}

export interface ITaskWithRelations extends ITask {
  createdBy: IUserPublic;
  assignedTo: IUserPublic | null;
}

export interface ICreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  assignedToId?: string;
}

export interface IUpdateTaskInput {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  dueDate?: Date | null;
  assignedToId?: string | null;
}

// ==================== Auth Types ====================
export interface IAuthPayload {
  userId: string;
  email: string;
}

export interface ITokenPayload {
  user: IUserPublic;
  token: string;
}

// ==================== Request Types ====================
export interface IAuthenticatedRequest {
  user?: IAuthPayload;
}

// Re-export enums for convenience
export { Status, Priority };
