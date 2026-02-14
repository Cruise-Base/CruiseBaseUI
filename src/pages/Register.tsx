import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Mail, Lock, User, Phone, Briefcase, ChevronRight, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import logo from '../assets/logo.png';

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(10, 'Invalid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['Owner', 'Driver']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'Driver',
        },
    });

    const selectedRole = watch('role');

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
        const payload = {
            ...data,
            role: data.role === 'Owner' ? 0 : 1 // 0 for Owner, 1 for Driver
        };
        registerMutation.mutate(payload);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 py-12 bg-black">
            <div className="w-full max-w-[600px] border border-slate-800 bg-slate-950 p-12 rounded-none shadow-none">
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
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2 uppercase">Create Account</h1>
                    <p className="text-slate-500 font-medium">
                        Join the professional logistics network.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                            <div className="relative">
                                <input
                                    {...register('firstName')}
                                    className="w-full bg-black border border-slate-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-slate-700"
                                    placeholder="JOHN"
                                />
                            </div>
                            {errors.firstName && <p className="text-xs text-blue-500 font-medium mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                            <div className="relative">
                                <input
                                    {...register('lastName')}
                                    className="w-full bg-black border border-slate-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-slate-700"
                                    placeholder="DOE"
                                />
                            </div>
                            {errors.lastName && <p className="text-xs text-blue-500 font-medium mt-1">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                {...register('username')}
                                className="w-full bg-black border border-slate-800 rounded-none pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-slate-700"
                                placeholder="johndoe88"
                            />
                        </div>
                        {errors.username && <p className="text-xs text-blue-500 font-medium mt-1">{errors.username.message}</p>}
                    </div>

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
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                {...register('phoneNumber')}
                                className="w-full bg-black border border-slate-800 rounded-none pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors placeholder:text-slate-700"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        {errors.phoneNumber && <p className="text-xs text-blue-500 font-medium mt-1">{errors.phoneNumber.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
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

                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Account Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="cursor-pointer group/role">
                                <input type="radio" {...register('role')} value="Driver" className="peer sr-only" />
                                <div className="h-full p-6 border border-slate-800 bg-black hover:border-slate-600 peer-checked:border-blue-600 peer-checked:bg-blue-600/10 transition-all text-center">
                                    <Briefcase className={`w-8 h-8 mx-auto mb-3 ${selectedRole === 'Driver' ? 'text-blue-500' : 'text-slate-600'}`} />
                                    <span className={`text-sm font-bold uppercase tracking-wider ${selectedRole === 'Driver' ? 'text-blue-500' : 'text-slate-400'}`}>Driver</span>
                                </div>
                            </label>
                            <label className="cursor-pointer group/role">
                                <input type="radio" {...register('role')} value="Owner" className="peer sr-only" />
                                <div className="h-full p-6 border border-slate-800 bg-black hover:border-slate-600 peer-checked:border-white peer-checked:bg-white/5 transition-all text-center">
                                    <ShieldCheck className={`w-8 h-8 mx-auto mb-3 ${selectedRole === 'Owner' ? 'text-white' : 'text-slate-600'}`} />
                                    <span className={`text-sm font-bold uppercase tracking-wider ${selectedRole === 'Owner' ? 'text-white' : 'text-slate-400'}`}>Owner</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-sm uppercase tracking-widest transition-all mt-4 border border-transparent hover:border-blue-500"
                    >
                        {registerMutation.isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Create Account
                                <ChevronRight className="w-4 h-4" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-900 text-center">
                    <p className="text-slate-500 text-sm">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-white font-bold hover:text-blue-500 transition-colors uppercase text-xs tracking-wider"
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
