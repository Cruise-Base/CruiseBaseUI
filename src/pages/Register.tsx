import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { UserPlus, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';

const registerSchema = z.object({
    fullName: z.string().min(3, 'Full name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['Owner', 'Driver']).optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'Driver',
        },
    });

    const registerMutation = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            alert('Registration successful! Please login.');
            navigate('/login');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Registration failed');
        },
    });

    const onSubmit = (data: RegisterFormValues) => {
        registerMutation.mutate({
            ...data,
            role: data.role || 'Driver'
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans text-white">
            <div className="w-full max-w-md bg-[#1e293b]/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-secondary/10 rounded-xl mb-4">
                        <UserPlus className="w-8 h-8 text-secondary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Join CruiseBase</h1>
                    <p className="text-slate-400 text-center">Start managing your vehicle assets or driving career today.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                        <input
                            {...register('fullName')}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                            placeholder="John Doe"
                        />
                        {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                            placeholder="name@example.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                {...register('role')}
                                value="Driver"
                                className="peer sr-only"
                            />
                            <div className="p-3 text-center border border-slate-700 rounded-lg bg-slate-900 peer-checked:border-secondary peer-checked:bg-secondary/10 transition-all">
                                Driver
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                {...register('role')}
                                value="Owner"
                                className="peer sr-only"
                            />
                            <div className="p-3 text-center border border-slate-700 rounded-lg bg-slate-900 peer-checked:border-secondary peer-checked:bg-secondary/10 transition-all">
                                Owner
                            </div>
                        </label>
                    </div>
                    {errors.role && <p className="mt-1 text-sm text-red-400">{errors.role.message}</p>}

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-secondary/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {registerMutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-primary font-medium hover:underline"
                        >
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
