import api from './api';
import { User, LoginInput, RegisterInput, ApiResponse } from '../types';

export const authService = {
    async login(input: LoginInput): Promise<User> {
        const response = await api.post<ApiResponse<{ user: User }>>('/auth/login', input);
        return response.data.data.user;
    },

    async register(input: RegisterInput): Promise<User> {
        const response = await api.post<ApiResponse<{ user: User }>>('/auth/register', input);
        return response.data.data.user;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
        return response.data.data.user;
    },

    async getUsers(): Promise<User[]> {
        const response = await api.get<ApiResponse<{ users: User[] }>>('/auth/users');
        return response.data.data.users;
    },
};
