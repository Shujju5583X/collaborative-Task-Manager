import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

interface ErrorResponse {
    success: false;
    message: string;
    errors?: string[];
}

export const errorMiddleware = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('Error:', err);

    if (err instanceof AppError) {
        const response: ErrorResponse = {
            success: false,
            message: err.message,
        };
        res.status(err.statusCode).json(response);
        return;
    }

    // Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const response: ErrorResponse = {
            success: false,
            message: 'Database operation failed',
        };
        res.status(400).json(response);
        return;
    }

    // Default error
    const response: ErrorResponse = {
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    };
    res.status(500).json(response);
};
