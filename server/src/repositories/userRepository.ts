import prisma from '../utils/prisma';
import { ICreateUserInput, IUser, IUserPublic } from '../types';

const selectPublicFields = {
    id: true,
    email: true,
    name: true,
    createdAt: true,
};

export const userRepository = {
    async findById(id: string): Promise<IUser | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    async findByIdPublic(id: string): Promise<IUserPublic | null> {
        return prisma.user.findUnique({
            where: { id },
            select: selectPublicFields,
        });
    },

    async findByEmail(email: string): Promise<IUser | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async create(data: ICreateUserInput): Promise<IUser> {
        return prisma.user.create({
            data,
        });
    },

    async findAll(): Promise<IUserPublic[]> {
        return prisma.user.findMany({
            select: selectPublicFields,
            orderBy: { name: 'asc' },
        });
    },
};
