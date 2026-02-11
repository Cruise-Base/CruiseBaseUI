import type { Transaction } from '@/types';
import {
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react';

interface TransactionHistoryProps {
    transactions: Transaction[];
    isLoading?: boolean;
}

export const TransactionHistory = ({ transactions, isLoading }: TransactionHistoryProps) => {
    const getStatusIcon = (status: Transaction['status']) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="w-4 h-4 text-secondary" />;
            case 'Pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'Failed': return <XCircle className="w-4 h-4 text-red-500" />;
        }
    };

    const getTypeIcon = (type: Transaction['type']) => {
        return type === 'Withdrawal' || type === 'Commission'
            ? <ArrowUpRight className="w-5 h-5 text-red-400 p-1 bg-red-400/10 rounded-lg" />
            : <ArrowDownLeft className="w-5 h-5 text-secondary p-1 bg-secondary/10 rounded-lg" />;
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-800/50 animate-pulse rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                <button className="text-sm text-primary hover:underline font-medium">View All</button>
            </div>

            <div className="overflow-hidden bg-[#1e293b]/50 border border-slate-800 rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Type & Description</th>
                                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {getTypeIcon(tx.type)}
                                            <div>
                                                <p className="font-medium text-white group-hover:text-primary transition-colors">{tx.type}</p>
                                                <p className="text-xs text-slate-500 truncate max-w-[200px]">{tx.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <p className={`font-semibold ${tx.type === 'Withdrawal' ? 'text-white' : 'text-secondary'}`}>
                                            {tx.type === 'Withdrawal' ? '-' : '+'}{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(tx.amount)}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            {getStatusIcon(tx.status)}
                                            <span className="text-slate-300">{tx.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
