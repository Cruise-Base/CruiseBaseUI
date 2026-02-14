import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import { ContractProgressBar } from '../components/vehicles/ContractProgressBar';
import { Car, Calendar, CreditCard, Loader2 } from 'lucide-react';

const DriverDashboard = () => {
    // For demo purposes, we'll assume the driver has one vehicle. 
    // In a real app, this would come from the user profile or a specific endpoint.
    const { data: progress, isLoading: isProgressLoading } = useQuery({
        queryKey: ['driver-progress'],
        queryFn: () => vehicleService.getDriverProgress('current'), // 'current' is a placeholder ID
    });

    if (isProgressLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Ownership Progress Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <Car className="w-6 h-6 text-primary" />
                            Vehicle Ownership Progress
                        </h3>
                    </div>

                    <div className="bg-[#1e293b]/50 border border-slate-800 p-8 rounded-3xl shadow-xl backdrop-blur-md">
                        <ContractProgressBar
                            label="Gross Ownership Progress"
                            totalValue={progress?.totalValue || 4500000}
                            paidAmount={progress?.paidAmount || 1200000}
                            percentage={progress?.percentage || 26.7}
                            color="var(--color-primary)"
                        />
                        <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Upon reaching <span className="text-primary font-bold">100%</span>, legal ownership of the vehicle will be transferred to you. Keep up the consistent payments!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-4 hover:bg-slate-800/50 transition-all border-l-4 border-l-secondary">
                        <div className="p-3 bg-secondary/10 rounded-2xl">
                            <Calendar className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">NEXT PAYMENT</p>
                            <p className="text-xl font-bold text-white">Feb 15, 2026</p>
                        </div>
                    </div>

                    <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-4 hover:bg-slate-800/50 transition-all border-l-4 border-l-primary">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <CreditCard className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">WEEKLY TARGET</p>
                            <p className="text-xl font-bold text-white">₦45,000</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 p-6 rounded-3xl group cursor-pointer hover:border-primary/40 transition-all">
                        <p className="text-xs text-slate-400 font-bold mb-2 uppercase">Current Vehicle</p>
                        <h4 className="text-lg font-bold text-white mb-1">Toyota Corolla 2022</h4>
                        <p className="text-xs text-slate-500">LND-458-KY • Black</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
