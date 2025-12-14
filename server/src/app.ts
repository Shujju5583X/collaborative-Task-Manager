import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorMiddleware } from './middlewares';

const createApp = (): Application => {
    const app = express();

    // CORS configuration
    app.use(cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    }));

    // Middleware
    app.use(express.json());
    app.use(cookieParser());

    // API Routes
    app.use('/api', routes);

    // Error handling
    app.use(errorMiddleware);

    return app;
};

export default createApp;
