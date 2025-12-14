import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { authService } from '../services';
import cookie from 'cookie';

let io: Server;

export const initializeSocket = (httpServer: HttpServer): Server => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true,
        },
    });

    // Authentication middleware for socket connections
    io.use((socket, next) => {
        try {
            const cookies = socket.handshake.headers.cookie;
            if (!cookies) {
                return next(new Error('Authentication required'));
            }

            const parsedCookies = cookie.parse(cookies);
            const token = parsedCookies.token;

            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = authService.verifyToken(token);
            socket.data.user = decoded;
            next();
        } catch {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket: Socket) => {
        const userId = socket.data.user?.userId;
        console.log(`User connected: ${userId}`);

        // Join user-specific room for targeted notifications
        if (userId) {
            socket.join(`user:${userId}`);
        }

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId}`);
        });

        // Client can subscribe to specific task updates
        socket.on('SUBSCRIBE_TASK', (taskId: string) => {
            socket.join(`task:${taskId}`);
        });

        socket.on('UNSUBSCRIBE_TASK', (taskId: string) => {
            socket.leave(`task:${taskId}`);
        });
    });

    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
