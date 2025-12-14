import { useState } from 'react';
import { Layout, TaskList, TaskModal } from '../components';
import { useMyTasks } from '../hooks';
import { Task } from '../types';
import { ListTodo } from 'lucide-react';

const MyTasks = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { data: tasks, isLoading } = useMyTasks();

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
                <div className="p-3 rounded-xl bg-primary-500/10">
                    <ListTodo className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">My Tasks</h1>
                    <p className="text-dark-400 mt-1">Tasks assigned to you</p>
                </div>
            </div>

            {/* Task List */}
            <TaskList
                tasks={tasks}
                isLoading={isLoading}
                emptyMessage="No tasks assigned to you yet"
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

export default MyTasks;
