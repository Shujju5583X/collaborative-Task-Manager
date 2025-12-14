import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, CreateTaskInput, UpdateTaskInput, Priority, Status } from '../types';
import { useCreateTask, useUpdateTask, useUsers } from '../hooks';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
}

const TaskModal = ({ isOpen, onClose, task }: TaskModalProps) => {
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();
    const { data: users } = useUsers();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: Priority.MEDIUM,
        status: Status.TODO,
        dueDate: '',
        assignedToId: '',
    });

    const isEditing = !!task;

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                assignedToId: task.assignedToId || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: Priority.MEDIUM,
                status: Status.TODO,
                dueDate: '',
                assignedToId: '',
            });
        }
    }, [task, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && task) {
            const input: UpdateTaskInput = {
                title: formData.title,
                description: formData.description || null,
                priority: formData.priority,
                status: formData.status,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
                assignedToId: formData.assignedToId || null,
            };
            await updateTask.mutateAsync({ id: task.id, input });
        } else {
            const input: CreateTaskInput = {
                title: formData.title,
                description: formData.description || undefined,
                priority: formData.priority,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
                assignedToId: formData.assignedToId || undefined,
            };
            await createTask.mutateAsync(input);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass-card w-full max-w-lg p-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        {isEditing ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="label">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input"
                            placeholder="Enter task title"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="label">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input min-h-[100px] resize-none"
                            placeholder="Enter task description"
                        />
                    </div>

                    {/* Priority & Status Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                                className="input"
                            >
                                <option value={Priority.LOW}>Low</option>
                                <option value={Priority.MEDIUM}>Medium</option>
                                <option value={Priority.HIGH}>High</option>
                            </select>
                        </div>

                        {isEditing && (
                            <div>
                                <label className="label">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                                    className="input"
                                >
                                    <option value={Status.TODO}>To Do</option>
                                    <option value={Status.IN_PROGRESS}>In Progress</option>
                                    <option value={Status.COMPLETED}>Completed</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="label">Due Date</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="input"
                        />
                    </div>

                    {/* Assign To */}
                    <div>
                        <label className="label">Assign To</label>
                        <select
                            value={formData.assignedToId}
                            onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                            className="input"
                        >
                            <option value="">Unassigned</option>
                            {users?.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createTask.isPending || updateTask.isPending}
                            className="btn-primary"
                        >
                            {createTask.isPending || updateTask.isPending
                                ? 'Saving...'
                                : isEditing
                                    ? 'Update Task'
                                    : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
