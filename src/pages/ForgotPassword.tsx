import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Mail, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import { api } from '../services/api';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const resetMutation = useMutation({
        mutationFn: async (data: ForgotPasswordFormValues) => {
            await api.post('/api/authentication/forgot-password', data);
        },
        onSuccess: () => {
            alert('If an account exists with that email, a reset link has been sent.');
            navigate('/login');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Something went wrong');
        },
    });

    const onSubmit = (data: ForgotPasswordFormValues) => {
        resetMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
            <div className="w-full max-w-[480px] border border-slate-800 bg-slate-950 p-12 rounded-none shadow-none">

                <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors mb-8 uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>

                <div className="mb-10 text-center">
                    <div className="size-16 bg-blue-600 flex items-center justify-center mx-auto mb-6">
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2 uppercase">Reset Password</h1>
                    <p className="text-slate-500 font-medium">
                        Enter your email and we'll send you instructions to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                {...register('email')}
                                type="email"
                                className="w-full bg-black border border-slate-800 rounded-none pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-slate-700"
                                placeholder="name@company.com"
                            />
                        </div>
                        {errors.email && <p className="text-xs text-blue-500 font-medium mt-1">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={resetMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-sm uppercase tracking-widest transition-all mt-4 border border-transparent hover:border-blue-500"
                    >
                        {resetMutation.isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending link...
                            </span>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
