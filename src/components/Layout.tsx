import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import {
    LayoutDashboard,
    Wallet,
    Car,
    Users,
    LogOut,
    Menu,
    ChevronRight,
    Bell,
    User
} from 'lucide-react';
import logo from '../assets/logo.png';

export const Layout = () => {
    const { user, logout } = useAuthStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { data: userDetails } = useQuery({
        queryKey: ['userDetails'],
        queryFn: authService.getUserDetails,
        enabled: !!user,
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: `/${user?.role?.toLowerCase()}`, icon: LayoutDashboard, roles: ['Admin', 'SuperAdmin', 'Owner', 'Driver'] },
        { name: 'Profile', path: '/profile', icon: User, roles: ['Admin', 'SuperAdmin', 'Owner', 'Driver'] },
        { name: 'Wallet', path: '/wallet', icon: Wallet, roles: ['Owner', 'Driver'] },
        { name: 'My Fleet', path: '/owner/fleet', icon: Car, roles: ['Owner'] },
        { name: 'My Vehicle', path: '/driver/vehicle', icon: Car, roles: ['Driver'] },
        { name: 'User Management', path: '/admin/users', icon: Users, roles: ['Admin', 'SuperAdmin'] },
        { name: 'Vehicles', path: '/admin/vehicles', icon: Car, roles: ['Admin', 'SuperAdmin'] },
    ].filter(link => !link.roles || (user && link.roles.includes(user.role)));

    return (
        <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#1e293b] border-r border-slate-800 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="h-24 flex items-center px-6 border-b border-slate-800">
                        {logo ? (
                            <img src={logo} alt="CruiseBase" className="h-12 w-auto object-contain" />
                        ) : (
                            <div className="size-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center font-black text-white text-sm">
                                CB
                            </div>
                        )}
                        <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            CruiseBase
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;
                            return (
                                <button
                                    key={link.path}
                                    onClick={() => {
                                        navigate(link.path);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive
                                            ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_-5px_var(--color-primary)]'
                                            : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}
                  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'group-hover:text-slate-200'}`} />
                                        <span className="font-medium">{link.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-slate-800 bg-[#1e293b]/50">
                        <div className="flex items-center gap-3 px-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 overflow-hidden">
                                {userDetails?.profilePicture ? (
                                    <img src={userDetails.profilePicture} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm font-bold">{user?.fullName?.charAt(0) || 'U'}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
                                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all font-medium"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-400 hover:text-white"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-semibold text-white truncate">
                            {navLinks.find(l => location.pathname === l.path)?.name || 'Welcome'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1e293b]"></span>
                        </button>
                        <div className="h-6 w-px bg-slate-800 mx-2" />
                        <div
                            className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate('/profile')}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">{user?.fullName}</p>
                                <p className="text-xs text-slate-500 capitalize">Active {user?.role}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 overflow-hidden">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold overflow-hidden">
                                    {userDetails?.profilePicture ? (
                                        <img src={userDetails.profilePicture} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.fullName?.charAt(0)
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-4 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
