import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories';
import { ICreateUserInput, ILoginInput, IUserPublic, IAuthPayload } from '../types';
import { ConflictError, UnauthorizedError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const authService = {
    async register(input: ICreateUserInput): Promise<{ user: IUserPublic; token: string }> {
        // Check if user already exists
        const existingUser = await userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 12);

        // Create user
        const user = await userRepository.create({
            ...input,
            password: hashedPassword,
        });

        // Generate token
        const token = this.generateToken({ userId: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            token,
        };
    },

    async login(input: ILoginInput): Promise<{ user: IUserPublic; token: string }> {
        // Find user
        const user = await userRepository.findByEmail(input.email);
        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Check password
        const isValidPassword = await bcrypt.compare(input.password, user.password);
        if (!isValidPassword) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Generate token
        const token = this.generateToken({ userId: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
            },
            token,
        };
    },

    generateToken(payload: IAuthPayload): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
    },

    verifyToken(token: string): IAuthPayload {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as IAuthPayload;
            return decoded;
        } catch {
            throw new UnauthorizedError('Invalid or expired token');
        }
    },

    async getCurrentUser(userId: string): Promise<IUserPublic | null> {
        return userRepository.findByIdPublic(userId);
    },

    async getAllUsers(): Promise<IUserPublic[]> {
        return userRepository.findAll();
    },
};
