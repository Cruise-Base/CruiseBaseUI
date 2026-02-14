import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { walletService } from '../../services/walletService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const withdrawSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    pin: z.string().length(4, 'PIN must be 4 digits'),
});

type WithdrawFormValues = z.infer<typeof withdrawSchema>;

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    balance: number;
}

export const WithdrawalModal = ({ isOpen, onClose, balance }: WithdrawalModalProps) => {
    const queryClient = useQueryClient();
    const [step, setStep] = useState<'amount' | 'bank' | 'pin'>('amount');
    const [selectedBankId, setSelectedBankId] = useState<string>('');

    const { data: bankAccounts, isLoading: isLoadingBanks } = useQuery({
        queryKey: ['user-bank-accounts'],
        queryFn: walletService.getUserBankAccounts,
        enabled: isOpen,
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<WithdrawFormValues>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            amount: 0,
        },
    });

    const amount = watch('amount');

    const withdrawMutation = useMutation({
        mutationFn: (data: WithdrawFormValues) => walletService.withdraw(data.amount, selectedBankId, data.pin),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            alert('Withdrawal request submitted successfully!');
            onClose();
            setStep('amount');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Withdrawal failed');
        },
    });

    const onSubmit = (data: WithdrawFormValues) => {
        if (step === 'amount') {
            if (data.amount > balance) {
                alert('Insufficient balance');
                return;
            }
            setStep('bank');
        } else if (step === 'bank') {
            if (!selectedBankId) {
                alert('Please select a bank account');
                return;
            }
            setStep('pin');
        } else {
            withdrawMutation.mutate(data);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-[#1e293b] border border-slate-800 p-8 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">Withdraw Funds</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {step === 'amount' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-primary" />
                                    <p className="text-sm text-slate-300">
                                        Available Balance: <span className="text-white font-bold">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(balance)}</span>
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">AMOUNT TO WITHDRAW</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">NGN</span>
                                        <input
                                            {...register('amount', { valueAsNumber: true })}
                                            type="number"
                                            className="w-full pl-16 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-slate-700"
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.amount && <p className="mt-2 text-sm text-red-400">{errors.amount.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-[0.98]"
                                >
                                    Continue
                                </button>
                            </motion.div>
                        )}

                        {step === 'bank' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Select Bank Account</h3>
                                    {isLoadingBanks ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {bankAccounts && bankAccounts.length > 0 ? (
                                                bankAccounts.map((bank: any) => (
                                                    <div
                                                        key={bank.id}
                                                        onClick={() => setSelectedBankId(bank.id)}
                                                        className={`p-4 border rounded-2xl cursor-pointer transition-all ${selectedBankId === bank.id ? 'bg-primary/10 border-primary' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                                                    >
                                                        <p className="font-bold text-white">{bank.bankName}</p>
                                                        <p className="text-sm text-slate-400">{bank.accountNumber} - {bank.accountName}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-slate-400">
                                                    No bank accounts linked. Please add a bank account first.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep('amount')}
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg transition-all"
                                        disabled={!selectedBankId}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'pin' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6 text-center"
                            >
                                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                                    <ShieldCheck className="w-10 h-10 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Enter Transaction PIN</h3>
                                    <p className="text-slate-400 text-sm">Enter your 4-digit security PIN to authorize withdrawal of <span className="text-white font-bold">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)}</span></p>
                                </div>

                                <div className="flex justify-center gap-4">
                                    <input
                                        {...register('pin')}
                                        type="password"
                                        maxLength={4}
                                        autoFocus
                                        className="w-32 text-center px-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-3xl font-bold text-white tracking-[1em] focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                                    />
                                </div>
                                {errors.pin && <p className="text-sm text-red-400">{errors.pin.message}</p>}

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep('bank')}
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={withdrawMutation.isPending}
                                        className="flex-[2] bg-secondary hover:bg-secondary/90 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        {withdrawMutation.isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            'Confirm Withdrawal'
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
