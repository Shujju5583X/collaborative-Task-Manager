import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { RegisterInput, LoginInput } from '../utils/validation';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const authController = {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input: RegisterInput = req.body;
            const { user, token } = await authService.register(input);

            res.cookie('token', token, COOKIE_OPTIONS);
            res.status(201).json({
                success: true,
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input: LoginInput = req.body;
            const { user, token } = await authService.login(input);

            res.cookie('token', token, COOKIE_OPTIONS);
            res.json({
                success: true,
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    },

    async logout(_req: Request, res: Response): Promise<void> {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
        });
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    },

    async me(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const user = await authService.getCurrentUser(userId);

            res.json({
                success: true,
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    },

    async getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await authService.getAllUsers();

            res.json({
                success: true,
                data: { users },
            });
        } catch (error) {
            next(error);
        }
    },
};
