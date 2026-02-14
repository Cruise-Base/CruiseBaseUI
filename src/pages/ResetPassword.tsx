import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Lock, Loader2, ShieldCheck, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const resetMutation = useMutation({
        mutationFn: async (data: any) => {
            await api.post('/api/authentication/reset-password', {
                token,
                newPassword: data.password
            });
        },
        onSuccess: () => {
            alert('Password has been reset successfully!');
            navigate('/login');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Reset failed. Token may be invalid or expired.');
        },
    });

    const onSubmit = (data: ResetPasswordFormValues) => {
        if (!token) {
            alert('Invalid or missing reset token.');
            return;
        }
        resetMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
            <div className="w-full max-w-[480px] border border-slate-800 bg-slate-950 p-12 rounded-none shadow-none">

                <div className="mb-10 text-center">
                    <div className="size-16 bg-blue-600 flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2 uppercase">Set New Password</h1>
                    <p className="text-slate-500 font-medium">
                        Please enter your new password below to regain access to your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                {...register('password')}
                                type="password"
                                className="w-full bg-black border border-slate-800 rounded-none pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-slate-700"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="text-xs text-blue-500 font-medium mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                className="w-full bg-black border border-slate-800 rounded-none pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-slate-700"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-blue-500 font-medium mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={resetMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-sm uppercase tracking-widest transition-all mt-4 border border-transparent hover:border-blue-500"
                    >
                        {resetMutation.isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Update Password
                                <ChevronRight className="w-4 h-4" />
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
