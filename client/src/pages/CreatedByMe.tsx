import { useState } from 'react';
import { Layout, TaskList, TaskModal } from '../components';
import { useCreatedByMe } from '../hooks';
import { Task } from '../types';
import { FolderPlus, Plus } from 'lucide-react';

const CreatedByMe = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { data: tasks, isLoading } = useCreatedByMe();

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
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10">
                        <FolderPlus className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Created by Me</h1>
                        <p className="text-dark-400 mt-1">Tasks you have created</p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    New Task
                </button>
            </div>

            {/* Task List */}
            <TaskList
                tasks={tasks}
                isLoading={isLoading}
                emptyMessage="You haven't created any tasks yet"
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

export default CreatedByMe;
