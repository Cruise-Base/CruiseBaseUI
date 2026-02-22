import { useQuery } from '@tanstack/react-query';
import { walletService } from '@/services/walletService';
import { vehicleService } from '@/services/vehicleService';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { TransactionHistory } from '../components/wallet/TransactionHistory';
import { ContractProgressBar } from '../components/vehicles/ContractProgressBar';
import { Briefcase, Users, TrendingUp, Loader2, PieChart } from 'lucide-react';

const OwnerDashboard = () => {
    const { data: wallet, isLoading: isWalletLoading } = useQuery({
        queryKey: ['wallet-balance'],
        queryFn: walletService.getBalance,
    });

    const { data: transactions, isLoading: isTxLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => walletService.getTransactionHistory(1, 5),
    });

    // Demo progress for one of the vehicles in the fleet
    const { data: progress, isLoading: isProgressLoading } = useQuery({
        queryKey: ['owner-progress'],
        queryFn: () => vehicleService.getOwnerProgress('fleet-1'),
        enabled: !!wallet,
    });

    if (isWalletLoading || isTxLoading || isProgressLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Fleet Overview</h2>
                    <p className="text-sm text-slate-500">Manage your vehicles and monitor performance</p>
                </div>
            </div>

            {/* Top Section: Balance & Fleet Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <BalanceCard
                        balance={wallet?.balance || 0}
                        showFundButton={false}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                        <div className="p-3 bg-secondary/10 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">TOTAL EARNINGS</p>
                            <p className="text-xl font-bold text-white">₦12,450,000</p>
                        </div>
                    </div>

                    <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">ACTIVE DRIVERS</p>
                            <p className="text-xl font-bold text-white">14 Drivers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mid Section: Fleet Performance & Revenue */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-secondary" />
                            Revenue Payout Progress (Net)
                        </h3>
                        <span className="text-xs text-slate-500 font-medium">After 10% Commission</span>
                    </div>

                    <ContractProgressBar
                        label="Net Payout Progress (Owner)"
                        totalValue={progress?.totalValue || 4050000} // Total minus 10%
                        paidAmount={progress?.paidAmount || 1080000}
                        percentage={progress?.percentage || 26.7}
                        color="var(--color-secondary)"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <PieChart className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Fleet Status</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-bold text-white">92%</span>
                                <span className="text-[10px] text-secondary font-bold">+4% this month</span>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <Users className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Acquisition</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-bold text-white">3 New</span>
                                <span className="text-[10px] text-primary font-bold">In Pipeline</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1e293b]/20 rounded-3xl p-1 border border-transparent">
                    <TransactionHistory transactions={transactions?.transactions || []} />
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
