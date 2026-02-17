import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { vehicleService } from '../services/vehicleService';
import { AddVehicleModal } from '../components/vehicles/AddVehicleModal';
import {
    Users,
    Car,
    ShieldAlert,
    TrendingUp,
    ArrowUpRight,
    Loader2,
    Plus
} from 'lucide-react';

const AdminDashboard = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { isLoading: isVehiclesLoading } = useQuery({
        queryKey: ['all-vehicles'],
        queryFn: vehicleService.getVehicles,
    });

    if (isVehiclesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    const stats = [
        { name: 'System Revenue', value: '₦45.2M', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
        { name: 'Total Users', value: '1,240', icon: Users, color: 'text-secondary', bg: 'bg-secondary/10' },
        { name: 'Total Vehicles', value: '458', icon: Car, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { name: 'Pending Approvals', value: '12', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">System Administration</h2>
                    <p className="text-sm text-slate-500">Monitor system performance and manage assets</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Add Vehicle
                </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-all">
                        <div className={`absolute -right-2 -bottom-2 opacity-5 scale-150 group-hover:scale-125 transition-transform duration-500 ${stat.color}`}>
                            <stat.icon className="w-24 h-24" />
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-sm text-slate-500 font-medium">{stat.name}</p>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* System Activity Chart Placeholder */}
                <div className="xl:col-span-2 bg-[#1e293b]/50 border border-slate-800 p-8 rounded-3xl min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Revenue Growth</h3>
                            <p className="text-sm text-slate-500">System-wide revenue distribution over time</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-slate-800 text-xs rounded-lg text-slate-300">Week</button>
                            <button className="px-3 py-1 bg-primary text-xs rounded-lg text-white font-bold">Month</button>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end gap-2 px-4">
                        {[40, 60, 45, 90, 65, 80, 55, 75, 95, 100, 85, 70].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-800/50 rounded-t-lg relative group transition-all hover:bg-primary/20">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.05 }}
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/40 rounded-t-lg"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vehicle Approval Queue */}
                <div className="bg-[#1e293b]/50 border border-slate-800 p-8 rounded-3xl flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-6">Approval Queue</h3>
                    <div className="space-y-4 flex-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                                        <Car className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Toyota Corolla 2022</p>
                                        <p className="text-xs text-slate-500">Requested by Mark S.</p>
                                    </div>
                                </div>
                                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all">
                                    <ArrowUpRight className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 border border-slate-700 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        Manage All Applications
                    </button>
                </div>
            </div>

            <AddVehicleModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
};

export default AdminDashboard;
