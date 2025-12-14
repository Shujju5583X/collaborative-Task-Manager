import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useSocket } from '../context';
import {
    LayoutDashboard,
    ListTodo,
    FolderPlus,
    Clock,
    LogOut,
    Wifi,
    WifiOff,
    User
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isConnected } = useSocket();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/my-tasks', icon: ListTodo, label: 'My Tasks' },
        { path: '/created-by-me', icon: FolderPlus, label: 'Created by Me' },
        { path: '/overdue', icon: Clock, label: 'Overdue' },
    ];

    return (
        <nav className="glass-card sticky top-0 z-50 mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                            <ListTodo className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-white hidden sm:block">
                            Task Manager
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all 
                    ${isActive
                                            ? 'bg-primary-500/20 text-primary-400'
                                            : 'text-dark-300 hover:text-white hover:bg-dark-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Connection Status */}
                        <div className="flex items-center gap-2">
                            {isConnected ? (
                                <div className="flex items-center gap-1.5 text-emerald-400">
                                    <Wifi className="w-4 h-4" />
                                    <span className="text-xs hidden sm:block">Live</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-amber-400">
                                    <WifiOff className="w-4 h-4" />
                                    <span className="text-xs hidden sm:block">Offline</span>
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-700">
                                <User className="w-4 h-4 text-dark-400" />
                                <span className="text-sm text-dark-200">{user?.name}</span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-dark-300 
                         hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm hidden sm:block">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center justify-around py-2 border-t border-dark-700">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all 
                  ${isActive
                                        ? 'text-primary-400'
                                        : 'text-dark-400 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-xs">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
