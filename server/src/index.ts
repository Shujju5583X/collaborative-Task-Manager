import { createServer } from 'http';
import createApp from './app';
import { initializeSocket } from './socket';
import prisma from './utils/prisma';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected');

        // Create Express app
        const app = createApp();

        // Create HTTP server
        const httpServer = createServer(app);

        // Initialize Socket.io
        initializeSocket(httpServer);
        console.log('✅ Socket.io initialized');

        // Start server
        httpServer.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 WebSocket ready on ws://localhost:${PORT}`);
        });

        // Graceful shutdown
        const shutdown = async (): Promise<void> => {
            console.log('\n🔄 Shutting down gracefully...');
            await prisma.$disconnect();
            httpServer.close(() => {
                console.log('👋 Server closed');
                process.exit(0);
            });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

startServer();
