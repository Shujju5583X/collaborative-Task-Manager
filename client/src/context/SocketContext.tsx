import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { TaskCreatedEvent, TaskUpdatedEvent, TaskDeletedEvent, AssignmentNotificationEvent } from '../types';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isAuthenticated) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        // Real-time task events
        newSocket.on('TASK_CREATED', (data: TaskCreatedEvent) => {
            console.log('Task created:', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        newSocket.on('TASK_UPDATED', (data: TaskUpdatedEvent) => {
            console.log('Task updated:', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task', data.task.id] });
        });

        newSocket.on('TASK_DELETED', (data: TaskDeletedEvent) => {
            console.log('Task deleted:', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        // Assignment notifications
        newSocket.on('ASSIGNMENT_NOTIFICATION', (data: AssignmentNotificationEvent) => {
            console.log('Assignment notification:', data);

            switch (data.type) {
                case 'NEW_ASSIGNMENT':
                    toast.success(data.message, { icon: '📋' });
                    break;
                case 'UNASSIGNED':
                    toast(data.message, { icon: '👋' });
                    break;
                case 'TASK_DELETED':
                    toast(data.message, { icon: '🗑️' });
                    break;
            }

            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [isAuthenticated, queryClient]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
