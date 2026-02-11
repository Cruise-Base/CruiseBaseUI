import { useQuery } from '@tanstack/react-query';
import { walletService } from '@/services/walletService';
import { vehicleService } from '@/services/vehicleService';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { TransactionHistory } from '../components/wallet/TransactionHistory';
import { ContractProgressBar } from '../components/vehicles/ContractProgressBar';
import { Car, Calendar, CreditCard, Loader2 } from 'lucide-react';

const DriverDashboard = () => {
    const { data: wallet, isLoading: isWalletLoading } = useQuery({
        queryKey: ['wallet-balance'],
        queryFn: walletService.getBalance,
    });

    const { data: transactions, isLoading: isTxLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => walletService.getTransactionHistory(1, 5),
    });

    // For demo purposes, we'll assume the driver has one vehicle. 
    // In a real app, this would come from the user profile or a specific endpoint.
    const { data: progress, isLoading: isProgressLoading } = useQuery({
        queryKey: ['driver-progress'],
        queryFn: () => vehicleService.getDriverProgress('current'), // 'current' is a placeholder ID
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
            {/* Top Section: Balance & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <BalanceCard balance={wallet?.balance || 0} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                        <div className="p-3 bg-secondary/10 rounded-2xl">
                            <Calendar className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">NEXT PAYMENT</p>
                            <p className="text-xl font-bold text-white">Feb 15, 2026</p>
                        </div>
                    </div>

                    <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <CreditCard className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">WEEKLY TARGET</p>
                            <p className="text-xl font-bold text-white">₦45,000</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mid Section: Progress tracking */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Car className="w-5 h-5 text-primary" />
                            Vehicle Ownership Progress
                        </h3>
                    </div>
                    <ContractProgressBar
                        label="Gross Ownership Progress"
                        totalValue={progress?.totalValue || 4500000}
                        paidAmount={progress?.paidAmount || 1200000}
                        percentage={progress?.percentage || 26.7}
                        color="var(--color-primary)"
                    />
                    <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Upon reaching <span className="text-white font-bold">100%</span>, legal ownership of the vehicle will be transferred to you. Keep up the consistent payments!
                        </p>
                    </div>
                </div>

                {/* Transactions */}
                <TransactionHistory transactions={transactions?.transactions || []} />
            </div>
        </div>
    );
};

export default DriverDashboard;
