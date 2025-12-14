import { useState } from 'react';
import { Layout, TaskList, TaskModal } from '../components';
import { useOverdueTasks } from '../hooks';
import { Task } from '../types';
import { Clock, AlertTriangle } from 'lucide-react';

const Overdue = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { data: tasks, isLoading } = useOverdueTasks();

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    return (
        <Layout>
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-red-500/10">
                    <Clock className="w-6 h-6 text-red-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Overdue Tasks</h1>
                    <p className="text-dark-400 mt-1">Tasks past their due date</p>
                </div>
            </div>

            {/* Warning Banner */}
            {tasks && tasks.length > 0 && (
                <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-200">
                        You have <span className="font-semibold">{tasks.length}</span> overdue task{tasks.length !== 1 ? 's' : ''} that need attention.
                    </p>
                </div>
            )}

            {/* Task List */}
            <TaskList
                tasks={tasks}
                isLoading={isLoading}
                emptyMessage="🎉 No overdue tasks! You're all caught up."
                onEditTask={handleEditTask}
            />

            {/* Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                task={editingTask}
            />
        </Layout>
    );
};

export default Overdue;
