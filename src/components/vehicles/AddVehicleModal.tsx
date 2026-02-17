import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Car,
    Hash,
    Palette,
    Search,
    User,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { vehicleService } from '@/services/vehicleService';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/useAuthStore';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { VehicleToCreate } from '@/types';

const vehicleSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    brand: z.string().min(2, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    plateNumber: z.string().min(3, 'Plate number is required'),
    color: z.string().min(2, 'Color is required'),
    userId: z.string().optional(),
    ownerPercentage: z.number().min(0).max(100).optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddVehicleModal = ({ isOpen, onClose }: AddVehicleModalProps) => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [foundUser, setFoundUser] = useState<{ id: string, fullName: string, email: string } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            ownerPercentage: 100,
        }
    });

    const createMutation = useMutation({
        mutationFn: vehicleService.createVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-vehicles'] });
            queryClient.invalidateQueries({ queryKey: ['owner-progress'] });
            onClose();
            reset();
            setFoundUser(null);
            setSearchTerm('');
        },
    });

    const handleSearch = async () => {
        if (!searchTerm) return;
        setIsSearching(true);
        setSearchError(null);
        try {
            const result = await userService.searchUser(searchTerm);
            setFoundUser({ id: result.id, fullName: result.fullName, email: result.email });
            setValue('userId', result.id);
        } catch (error) {
            setSearchError('User not found. Please check the email or phone number.');
            setFoundUser(null);
        } finally {
            setIsSearching(false);
        }
    };

    const onSubmit = (data: VehicleFormValues) => {
        const payload: VehicleToCreate = {
            ...data,
            userId: user?.role === 'Owner' ? user.id : data.userId
        };
        createMutation.mutate(payload);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#1e293b] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-xl text-primary">
                                    <Car className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Add New Vehicle</h3>
                                    <p className="text-sm text-slate-400">Register a new asset to the fleet</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                            {user?.role === 'Admin' || user?.role === 'SuperAdmin' ? (
                                <div className="space-y-4 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                                    <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                        <User className="w-4 h-4 text-primary" />
                                        ASSIGN TO OWNER
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="Search by email or phone..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSearch}
                                            disabled={isSearching}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                                        >
                                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                                        </button>
                                    </div>

                                    {foundUser && (
                                        <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-xl animate-in zoom-in-95 duration-200">
                                            <div className="p-2 bg-primary/20 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white truncate">{foundUser.fullName}</p>
                                                <p className="text-xs text-slate-400 truncate">{foundUser.email}</p>
                                            </div>
                                        </div>
                                    )}

                                    {searchError && (
                                        <div className="flex items-center gap-2 p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-xs">
                                            <AlertCircle className="w-4 h-4" />
                                            {searchError}
                                        </div>
                                    )}
                                    {errors.userId && <p className="text-xs text-red-400">{errors.userId.message}</p>}
                                </div>
                            ) : null}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Name</label>
                                    <div className="relative">
                                        <Car className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                        <input
                                            {...register('name')}
                                            placeholder="e.g. Shadow Rider"
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                    {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plate Number</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                        <input
                                            {...register('plateNumber')}
                                            placeholder="LND-123-XY"
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                    {errors.plateNumber && <p className="text-xs text-red-400">{errors.plateNumber.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</label>
                                    <input
                                        {...register('brand')}
                                        placeholder="Toyota"
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                    />
                                    {errors.brand && <p className="text-xs text-red-400">{errors.brand.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Model</label>
                                    <input
                                        {...register('model')}
                                        placeholder="Corolla 2022"
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                    />
                                    {errors.model && <p className="text-xs text-red-400">{errors.model.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Color</label>
                                    <div className="relative">
                                        <Palette className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                        <input
                                            {...register('color')}
                                            placeholder="Metallic Black"
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                    {errors.color && <p className="text-xs text-red-400">{errors.color.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Owner Percentage (%)</label>
                                    <input
                                        type="number"
                                        {...register('ownerPercentage', { valueAsNumber: true })}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                    />
                                    {errors.ownerPercentage && <p className="text-xs text-red-400">{errors.ownerPercentage.message}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {createMutation.isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Register Vehicle
                                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Internal component for the arrow icon used in the submit button
const ArrowUpRight = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
);
