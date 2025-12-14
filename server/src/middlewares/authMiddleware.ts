import { Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { IAuthPayload } from '../types';
import { UnauthorizedError } from '../utils/errors';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: IAuthPayload;
        }
    }
}

export const authMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from HttpOnly cookie
        const token = req.cookies?.token;

        if (!token) {
            throw new UnauthorizedError('Authentication required');
        }

        // Verify token and attach user to request
        const decoded = authService.verifyToken(token);
        req.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
};

// Optional auth - doesn't throw if no token
export const optionalAuthMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies?.token;

        if (token) {
            const decoded = authService.verifyToken(token);
            req.user = decoded;
        }

        next();
    } catch {
        // Token invalid, continue without user
        next();
    }
};
