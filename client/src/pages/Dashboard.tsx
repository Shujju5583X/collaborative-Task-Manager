import { useState } from 'react';
import { Layout, TaskList, TaskModal } from '../components';
import { useTasks, useMyTasks, useCreatedByMe, useOverdueTasks } from '../hooks';
import { Task, Status } from '../types';
import { Plus, ListTodo, FolderPlus, Clock, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const { data: allTasks, isLoading: loadingAll } = useTasks();
    const { data: myTasks } = useMyTasks();
    const { data: createdByMe } = useCreatedByMe();
    const { data: overdueTasks } = useOverdueTasks();

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    // Stats
    const stats = [
        {
            label: 'My Tasks',
            value: myTasks?.length || 0,
            icon: ListTodo,
            color: 'text-primary-400',
            bg: 'bg-primary-500/10',
        },
        {
            label: 'Created',
            value: createdByMe?.length || 0,
            icon: FolderPlus,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
        },
        {
            label: 'Overdue',
            value: overdueTasks?.length || 0,
            icon: Clock,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
        },
        {
            label: 'Completed',
            value: allTasks?.filter((t) => t.status === Status.COMPLETED).length || 0,
            icon: CheckCircle2,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
        },
    ];

    return (
        <Layout>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-dark-400 mt-1">Overview of all tasks</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    New Task
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="glass-card p-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-xs text-dark-400">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Tasks */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">All Tasks</h2>
                <TaskList
                    tasks={allTasks}
                    isLoading={loadingAll}
                    emptyMessage="No tasks yet. Create your first task!"
                    onEditTask={handleEditTask}
                />
            </div>

            {/* Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                task={editingTask}
            />
        </Layout>
    );
};

export default Dashboard;
