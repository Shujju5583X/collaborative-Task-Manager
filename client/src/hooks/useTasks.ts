import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services';
import { Task, CreateTaskInput, UpdateTaskInput, Status } from '../types';
import toast from 'react-hot-toast';

// Query keys
export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    myTasks: () => [...taskKeys.all, 'my-tasks'] as const,
    createdByMe: () => [...taskKeys.all, 'created-by-me'] as const,
    overdue: () => [...taskKeys.all, 'overdue'] as const,
    detail: (id: string) => [...taskKeys.all, 'detail', id] as const,
};

// Fetch all tasks
export const useTasks = () => {
    return useQuery({
        queryKey: taskKeys.lists(),
        queryFn: () => taskService.getTasks(),
    });
};

// Fetch my tasks (assigned to me)
export const useMyTasks = () => {
    return useQuery({
        queryKey: taskKeys.myTasks(),
        queryFn: () => taskService.getMyTasks(),
    });
};

// Fetch tasks created by me
export const useCreatedByMe = () => {
    return useQuery({
        queryKey: taskKeys.createdByMe(),
        queryFn: () => taskService.getCreatedByMe(),
    });
};

// Fetch overdue tasks
export const useOverdueTasks = () => {
    return useQuery({
        queryKey: taskKeys.overdue(),
        queryFn: () => taskService.getOverdueTasks(),
    });
};

// Fetch single task
export const useTask = (id: string) => {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => taskService.getTaskById(id),
        enabled: !!id,
    });
};

// Create task mutation
export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateTaskInput) => taskService.createTask(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            toast.success('Task created successfully!');
        },
        onError: () => {
            toast.error('Failed to create task');
        },
    });
};

// Update task mutation with optimistic updates
export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
            taskService.updateTask(id, input),

        // Optimistic update
        onMutate: async ({ id, input }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: taskKeys.all });

            // Snapshot previous values
            const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());
            const previousMyTasks = queryClient.getQueryData<Task[]>(taskKeys.myTasks());
            const previousCreatedByMe = queryClient.getQueryData<Task[]>(taskKeys.createdByMe());

            // Optimistically update all task lists
            const updateTaskInList = (tasks: Task[] | undefined) => {
                if (!tasks) return undefined;
                return tasks.map((task) =>
                    task.id === id ? { ...task, ...input, updatedAt: new Date().toISOString() } : task
                );
            };

            queryClient.setQueryData(taskKeys.lists(), updateTaskInList);
            queryClient.setQueryData(taskKeys.myTasks(), updateTaskInList);
            queryClient.setQueryData(taskKeys.createdByMe(), updateTaskInList);

            return { previousTasks, previousMyTasks, previousCreatedByMe };
        },

        // Rollback on error
        onError: (_err, _variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
            }
            if (context?.previousMyTasks) {
                queryClient.setQueryData(taskKeys.myTasks(), context.previousMyTasks);
            }
            if (context?.previousCreatedByMe) {
                queryClient.setQueryData(taskKeys.createdByMe(), context.previousCreatedByMe);
            }
            toast.error('Failed to update task');
        },

        onSuccess: () => {
            toast.success('Task updated!');
        },

        // Always refetch after error or success
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        },
    });
};

// Update task status mutation with optimistic updates
export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: Status }) =>
            taskService.updateTaskStatus(id, status),

        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.all });

            const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());
            const previousMyTasks = queryClient.getQueryData<Task[]>(taskKeys.myTasks());

            const updateStatus = (tasks: Task[] | undefined) => {
                if (!tasks) return undefined;
                return tasks.map((task) =>
                    task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task
                );
            };

            queryClient.setQueryData(taskKeys.lists(), updateStatus);
            queryClient.setQueryData(taskKeys.myTasks(), updateStatus);

            return { previousTasks, previousMyTasks };
        },

        onError: (_err, _variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
            }
            if (context?.previousMyTasks) {
                queryClient.setQueryData(taskKeys.myTasks(), context.previousMyTasks);
            }
            toast.error('Failed to update status');
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        },
    });
};

// Delete task mutation
export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => taskService.deleteTask(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.all });

            const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());

            queryClient.setQueryData(taskKeys.lists(), (old: Task[] | undefined) =>
                old?.filter((task) => task.id !== id)
            );

            return { previousTasks };
        },

        onError: (_err, _id, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
            }
            toast.error('Failed to delete task');
        },

        onSuccess: () => {
            toast.success('Task deleted');
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        },
    });
};
