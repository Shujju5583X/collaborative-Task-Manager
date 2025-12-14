import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors';

type ValidateTarget = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, target: ValidateTarget = 'body') => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            const data = schema.parse(req[target]);
            req[target] = data; // Replace with parsed/transformed data
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
                next(new BadRequestError(messages));
            } else {
                next(error);
            }
        }
    };
};
