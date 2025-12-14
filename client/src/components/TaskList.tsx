import { Task } from '../types';
import TaskCard from './TaskCard';
import { Loader2 } from 'lucide-react';

interface TaskListProps {
    tasks: Task[] | undefined;
    isLoading: boolean;
    emptyMessage?: string;
    onEditTask?: (task: Task) => void;
}

const TaskList = ({ tasks, isLoading, emptyMessage = 'No tasks found', onEditTask }: TaskListProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="glass-card p-8 text-center">
                <p className="text-dark-400">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} />
            ))}
        </div>
    );
};

export default TaskList;
