import { Task, Status, Priority } from '../types';
import { useUpdateTaskStatus, useDeleteTask } from '../hooks';
import { useAuth } from '../context';
import {
    Calendar,
    User,
    Trash2,
    ChevronDown,
    AlertCircle,
    CheckCircle2,
    Circle,
    Clock
} from 'lucide-react';
import { useState } from 'react';

interface TaskCardProps {
    task: Task;
    onEdit?: (task: Task) => void;
}

const statusConfig = {
    [Status.TODO]: {
        label: 'To Do',
        icon: Circle,
        className: 'badge-todo',
    },
    [Status.IN_PROGRESS]: {
        label: 'In Progress',
        icon: Clock,
        className: 'badge-in-progress',
    },
    [Status.COMPLETED]: {
        label: 'Completed',
        icon: CheckCircle2,
        className: 'badge-completed',
    },
};

const priorityConfig = {
    [Priority.LOW]: { label: 'Low', className: 'badge-low' },
    [Priority.MEDIUM]: { label: 'Medium', className: 'badge-medium' },
    [Priority.HIGH]: { label: 'High', className: 'badge-high' },
};

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
    const { user } = useAuth();
    const updateStatus = useUpdateTaskStatus();
    const deleteTask = useDeleteTask();
    const [showStatusMenu, setShowStatusMenu] = useState(false);

    const status = statusConfig[task.status];
    const priority = priorityConfig[task.priority];
    const StatusIcon = status.icon;

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== Status.COMPLETED;
    const isCreator = task.createdById === user?.id;

    const handleStatusChange = (newStatus: Status) => {
        updateStatus.mutate({ id: task.id, status: newStatus });
        setShowStatusMenu(false);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask.mutate(task.id);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div
            className={`glass-card p-4 hover:border-dark-500 transition-all cursor-pointer animate-fade-in
                  ${isOverdue ? 'border-red-500/50' : ''}`}
            onClick={() => onEdit?.(task)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-medium text-white line-clamp-1 flex-1">{task.title}</h3>
                <div className="flex items-center gap-2">
                    <span className={priority.className}>{priority.label}</span>
                </div>
            </div>

            {/* Description */}
            {task.description && (
                <p className="text-sm text-dark-400 line-clamp-2 mb-3">{task.description}</p>
            )}

            {/* Status Dropdown */}
            <div className="relative mb-3" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className={`${status.className} flex items-center gap-1.5 pr-2`}
                >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                    <ChevronDown className="w-3 h-3" />
                </button>

                {showStatusMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-dark-800 rounded-lg shadow-xl border border-dark-600 py-1 z-10">
                        {Object.entries(statusConfig).map(([key, config]) => {
                            const Icon = config.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleStatusChange(key as Status)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-dark-200 hover:bg-dark-700 transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                    {config.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-dark-700">
                <div className="flex items-center gap-4 text-xs text-dark-400">
                    {/* Due Date */}
                    {task.dueDate && (
                        <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
                            {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                            {formatDate(task.dueDate)}
                        </div>
                    )}

                    {/* Assignee */}
                    {task.assignedTo && (
                        <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {task.assignedTo.name}
                        </div>
                    )}
                </div>

                {/* Delete Button (only for creator) */}
                {isCreator && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                        className="p-1.5 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
