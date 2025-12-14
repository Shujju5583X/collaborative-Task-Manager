import api from './api';
import { Task, CreateTaskInput, UpdateTaskInput, ApiResponse, Status } from '../types';

export const taskService = {
    async getTasks(filters?: {
        status?: Status;
        assignedToMe?: boolean;
        createdByMe?: boolean;
        overdue?: boolean;
    }): Promise<Task[]> {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.assignedToMe) params.append('assignedToMe', 'true');
        if (filters?.createdByMe) params.append('createdByMe', 'true');
        if (filters?.overdue) params.append('overdue', 'true');

        const response = await api.get<ApiResponse<{ tasks: Task[] }>>(`/tasks?${params}`);
        return response.data.data.tasks;
    },

    async getMyTasks(): Promise<Task[]> {
        const response = await api.get<ApiResponse<{ tasks: Task[] }>>('/tasks/my-tasks');
        return response.data.data.tasks;
    },

    async getCreatedByMe(): Promise<Task[]> {
        const response = await api.get<ApiResponse<{ tasks: Task[] }>>('/tasks/created-by-me');
        return response.data.data.tasks;
    },

    async getOverdueTasks(): Promise<Task[]> {
        const response = await api.get<ApiResponse<{ tasks: Task[] }>>('/tasks/overdue');
        return response.data.data.tasks;
    },

    async getTaskById(id: string): Promise<Task> {
        const response = await api.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`);
        return response.data.data.task;
    },

    async createTask(input: CreateTaskInput): Promise<Task> {
        const response = await api.post<ApiResponse<{ task: Task }>>('/tasks', input);
        return response.data.data.task;
    },

    async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
        const response = await api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}`, input);
        return response.data.data.task;
    },

    async updateTaskStatus(id: string, status: Status): Promise<Task> {
        const response = await api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}/status`, { status });
        return response.data.data.task;
    },

    async deleteTask(id: string): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },
};
