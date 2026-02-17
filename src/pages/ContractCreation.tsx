import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Car,
    User as UserIcon,
    FileText,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import { useNavigate } from 'react-router-dom';

const contractSchema = z.object({
    vehicleId: z.string().min(1, 'Please select a vehicle'),
    driverEmail: z.string().email('Invalid driver email'),
    totalValue: z.number().min(100000, 'Total value must be at least ₦100,000'),
    weeklyPayment: z.number().min(5000, 'Weekly payment must be at least ₦5,000'),
    durationMonths: z.number().min(1, 'Duration must be at least 1 month'),
    startDate: z.string().min(1, 'Start date is required'),
});

type ContractFormValues = z.infer<typeof contractSchema>;

const steps = [
    { id: 'vehicle', title: 'Vehicle', icon: Car },
    { id: 'driver', title: 'Driver', icon: UserIcon },
    { id: 'terms', title: 'Terms', icon: FileText },
    { id: 'review', title: 'Review', icon: CheckCircle2 },
];

export const ContractCreationPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ContractFormValues>({
        resolver: zodResolver(contractSchema),
        defaultValues: {
            durationMonths: 24,
            startDate: new Date().toISOString().split('T')[0],
        },
    });

    const { data: vehicles, isLoading: isVehiclesLoading } = useQuery({
        queryKey: ['vehicles-for-contract'],
        queryFn: vehicleService.getVehicles,
    });

    const contractMutation = useMutation({
        mutationFn: vehicleService.createContract,
        onSuccess: () => {
            alert('Contract created successfully!');
            navigate('/admin/vehicles');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to create contract');
        },
    });

    const formValues = watch();
    const selectedVehicle = vehicles?.find(v => v.id === formValues.vehicleId);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const onSubmit = (data: ContractFormValues) => {
        if (currentStep < steps.length - 1) {
            nextStep();
        } else {
            contractMutation.mutate(data);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col items-center gap-2 mb-8">
                <h1 className="text-3xl font-bold text-white">New Vehicle Contract</h1>
                <p className="text-slate-400">Initialize a Hire Purchase or Rental agreement</p>
            </div>

            {/* Progress Stepper */}
            <div className="flex justify-between items-center px-4 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0 mx-8" />
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= currentStep;
                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive ? 'bg-primary text-white scale-110 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)]' : 'bg-slate-800 text-slate-500'}
                `}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-slate-500'}`}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-[#1e293b]/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl min-h-[400px]"
                    >
                        {currentStep === 0 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6">Select Asset</h3>
                                {isVehiclesLoading ? (
                                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {vehicles?.map(v => (
                                            <label key={v.id} className="cursor-pointer group">
                                                <input type="radio" {...register('vehicleId')} value={v.id} className="peer sr-only" />
                                                <div className="p-4 border border-slate-700/50 bg-slate-900/50 rounded-2xl peer-checked:border-primary peer-checked:bg-primary/10 hover:border-slate-600 transition-all flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center"><Car className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" /></div>
                                                    <div>
                                                        <p className="font-bold text-white">{v.brand} {v.model}</p>
                                                        <p className="text-xs text-slate-500">{v.plateNumber}</p>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {errors.vehicleId && <p className="text-sm text-red-400">{errors.vehicleId.message}</p>}
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6">Driver Details</h3>
                                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-secondary/10 rounded-full"><AlertCircle className="w-6 h-6 text-secondary" /></div>
                                    <p className="text-sm text-slate-400">Enter the registered email of the driver you wish to assign this vehicle to.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Driver Email Address</label>
                                    <input
                                        {...register('driverEmail')}
                                        placeholder="driver@example.com"
                                        className="w-full px-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    />
                                    {errors.driverEmail && <p className="mt-2 text-sm text-red-400">{errors.driverEmail.message}</p>}
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6">Financial Terms</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Total Contract Value (NGN)</label>
                                        <input
                                            {...register('totalValue', { valueAsNumber: true })}
                                            type="number"
                                            placeholder="e.g. 12000000"
                                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Weekly Repayment (NGN)</label>
                                        <input
                                            {...register('weeklyPayment', { valueAsNumber: true })}
                                            type="number"
                                            placeholder="e.g. 50000"
                                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Duration (Months)</label>
                                        <input
                                            {...register('durationMonths', { valueAsNumber: true })}
                                            type="number"
                                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Contract Start Date</label>
                                        <input
                                            {...register('startDate')}
                                            type="date"
                                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-6">Final Review</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selected Vehicle</p>
                                        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-4">
                                            <Car className="w-8 h-8 text-primary" />
                                            <div>
                                                <p className="font-bold text-white">{selectedVehicle?.brand} {selectedVehicle?.model}</p>
                                                <p className="text-xs text-slate-400">{selectedVehicle?.plateNumber}</p>
                                            </div>
                                        </div>

                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-6">Driver</p>
                                        <p className="text-lg font-bold text-white">{formValues.driverEmail}</p>
                                    </div>

                                    <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-4">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Financial Summary</p>
                                        <div className="flex justify-between py-2 border-b border-slate-800">
                                            <span className="text-slate-400">Total Value</span>
                                            <span className="text-white font-bold">₦{formValues.totalValue?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-800">
                                            <span className="text-slate-400">Weekly Payout</span>
                                            <span className="text-white font-bold">₦{formValues.weeklyPayment?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-slate-400">Commission (10%)</span>
                                            <span className="text-secondary font-bold">₦{(formValues.totalValue * 0.1)?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-between gap-4">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all flex items-center gap-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                    </button>

                    <button
                        type="submit"
                        disabled={contractMutation.isPending}
                        className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {currentStep === steps.length - 1 ? (
                            contractMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalize Contract'
                        ) : (
                            <>Next Step <ChevronRight className="w-5 h-5" /></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
