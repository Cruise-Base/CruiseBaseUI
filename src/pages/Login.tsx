import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LogIn, Loader2, Mail, Lock } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import logo from '../assets/logo.png';

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
        onSuccess: async (data) => {
            setCredentials(data.accessToken, data.refreshToken);

            try {
                const userDetails = await authService.getUserDetails();

                // Map backend roles array to frontend single role
                // Preference: Admin > SuperAdmin > Owner > Driver
                const roles = userDetails.roles || [];
                let mappedRole: 'Admin' | 'SuperAdmin' | 'Owner' | 'Driver' = 'Driver';

                if (roles.includes('Admin')) mappedRole = 'Admin';
                else if (roles.includes('SuperAdmin')) mappedRole = 'SuperAdmin';
                else if (roles.includes('Owner')) mappedRole = 'Owner';
                else if (roles.includes('Driver')) mappedRole = 'Driver';

                setUser({
                    id: userDetails.id,
                    email: userDetails.email,
                    fullName: `${userDetails.firstName} ${userDetails.lastName}`,
                    role: mappedRole,
                    profilePicture: userDetails.pictures?.url
                });

                navigate('/');
            } catch (error) {
                console.error('Failed to fetch user details', error);
                // Fallback or logout if we can't get details
                navigate('/');
            }
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Login failed');
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data);
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Logging in with ${provider}`);
        // Implement social login logic here
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
            <div className="w-full max-w-[480px] border border-slate-800 bg-slate-950 p-12 rounded-none shadow-none">
                <div className="flex flex-col items-center mb-12 text-center">
                    <div className="mb-8">
                        {logo ? (
                            <img src={logo} alt="CruiseBase" className="h-16 w-auto object-contain grayscale" />
                        ) : (
                            <div className="size-16 bg-blue-600 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white tracking-tighter">CB</span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2 uppercase">Welcome Back</h1>
                    <p className="text-slate-500 font-medium">
                        Sign in to access your dashboard.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                            <Link
                                to="/forgot-password"
                                className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-wider"
                            >
                                Forgot password?
                            </Link>
                        </div>
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

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-sm uppercase tracking-widest transition-all mt-4 border border-transparent hover:border-blue-500"
                    >
                        {loginMutation.isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Validating...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Log In
                                <LogIn className="w-4 h-4" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="my-10 flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-900" />
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">or continue with</span>
                    <div className="h-px flex-1 bg-slate-900" />
                </div>

                <button
                    onClick={() => handleSocialLogin('google')}
                    className="w-full bg-black border border-slate-800 text-slate-300 font-bold py-4 text-sm uppercase tracking-widest transition-all hover:bg-slate-900 hover:text-white flex items-center justify-center gap-3"
                >
                    <svg className="w-5 h-5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Google
                </button>

                <div className="mt-12 pt-8 border-t border-slate-900 text-center">
                    <p className="text-slate-500 text-sm">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-white font-bold hover:text-blue-500 transition-colors uppercase text-xs tracking-wider"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
