import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LogIn, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const navigate = useNavigate();
    const setCredentials = useAuthStore((state) => state.setCredentials);
    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            setCredentials(data.accessToken, data.refreshToken);
            setUser(data.user);
            navigate('/');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Login failed');
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
            <div className="w-full max-w-md bg-[#1e293b]/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl mb-4">
                        <LogIn className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">CruiseBase</h1>
                    <p className="text-slate-400">Welcome back! Please login to your account.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            placeholder="driver@cruisebase.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-primary/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loginMutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Login to Dashboard'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-secondary font-medium hover:underline"
                        >
                            Sign up as Owner/Driver
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
