import { motion } from 'framer-motion';

interface ContractProgressBarProps {
    label: string;
    totalValue: number;
    paidAmount: number;
    percentage: number;
    color?: string;
}

export const ContractProgressBar = ({
    label,
    totalValue,
    paidAmount,
    percentage,
    color = 'var(--color-primary)'
}: ContractProgressBarProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-3 bg-[#1e293b]/50 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">{label}</span>
                <span className="text-sm font-bold text-white">{percentage.toFixed(1)}%</span>
            </div>

            <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full shadow-[0_0_15px_-3px_rgba(0,0,0,0.5)]"
                    style={{ backgroundColor: color }}
                />
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Paid So Far</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(paidAmount)}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Total Contract Value</p>
                    <p className="text-sm font-medium text-slate-300">{formatCurrency(totalValue)}</p>
                </div>
            </div>
        </div>
    );
};
