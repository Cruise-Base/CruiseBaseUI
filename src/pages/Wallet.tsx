import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { walletService } from '../services/walletService';
import { BalanceCard } from '../components/wallet/BalanceCard';
import { TransactionHistory } from '../components/wallet/TransactionHistory';
import { WithdrawalModal } from '../components/wallet/WithdrawalModal';
import { Loader2, PlusCircle, CreditCard, Landmark } from 'lucide-react';

const WalletPage = () => {
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const { data: wallet, isLoading: isWalletLoading } = useQuery({
        queryKey: ['wallet-balance'],
        queryFn: walletService.getBalance,
    });

    const { data: transactions, isLoading: isTxLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => walletService.getTransactionHistory(1, 10),
    });

    if (isWalletLoading || isTxLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Balance Section */}
                <div className="lg:col-span-2 space-y-6">
                    <BalanceCard
                        balance={wallet?.balance || 0}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="flex items-center gap-4 p-6 bg-[#1e293b]/50 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all group">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <PlusCircle className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-white">Add Money</p>
                                <p className="text-xs text-slate-500">Fund your account</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setIsWithdrawModalOpen(true)}
                            className="flex items-center gap-4 p-6 bg-[#1e293b]/50 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all group"
                        >
                            <div className="p-3 bg-secondary/10 rounded-xl">
                                <CreditCard className="w-6 h-6 text-secondary" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-white">Withdraw</p>
                                <p className="text-xs text-slate-500">To your bank account</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Bank Account Section */}
                <div className="space-y-6">
                    <div className="bg-[#1e293b]/50 border border-slate-800 p-8 rounded-3xl h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-white">Linked Bank</h3>
                            <button className="text-xs font-bold text-primary uppercase tracking-wider">Update</button>
                        </div>

                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-slate-800 rounded-full">
                                <Landmark className="w-10 h-10 text-slate-500" />
                            </div>
                            <div>
                                <p className="font-bold text-white">Access Bank</p>
                                <p className="text-sm text-slate-400">•••• 4589</p>
                                <p className="text-xs text-slate-500 mt-1 uppercase font-medium">Verified Account</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Daily Limit</span>
                                <span className="text-white font-medium">₦500,000</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Processing Time</span>
                                <span className="text-white font-medium">Instant</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="mt-12">
                <TransactionHistory transactions={transactions?.transactions || []} />
            </div>

            {/* Shared Modals */}
            <WithdrawalModal
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                balance={wallet?.balance || 0}
            />
        </div>
    );
};

export default WalletPage;
