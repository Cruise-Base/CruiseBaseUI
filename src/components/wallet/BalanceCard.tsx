import { useState } from 'react';
import { Eye, EyeOff, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface BalanceCardProps {
    balance: number;
    currency?: string;
    showFundButton?: boolean;
}

export const BalanceCard = ({ balance, currency = 'NGN', showFundButton = true }: BalanceCardProps) => {
    const [isVisible, setIsVisible] = useState(true);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency,
        }).format(amount);
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <TrendingUp className="w-24 h-24 text-primary" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400 font-medium tracking-wide">TOTAL BALANCE</p>
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <div className="flex items-baseline gap-2 mb-8">
                    <h2 className="text-4xl font-bold text-white tracking-tight">
                        {isVisible ? formatCurrency(balance) : '••••••••'}
                    </h2>
                    <span className="text-slate-500 text-sm font-medium">{currency}</span>
                </div>

                <div className={`grid ${showFundButton ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    {showFundButton && (
                        <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-2xl transition-all group">
                            <ArrowUpRight className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-semibold">Fund Wallet</span>
                        </button>
                    )}
                    <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 py-3 rounded-2xl transition-all shadow-lg shadow-primary/20 group">
                        <ArrowDownLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-semibold">Withdraw</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
