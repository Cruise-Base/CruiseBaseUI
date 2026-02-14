import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, Loader2, Save, FileText, Calendar } from 'lucide-react';
import { authService } from '../../services/authService';

const editProfileSchema = z.object({
    firstName: z.string().min(2, 'First name is too short'),
    lastName: z.string().min(2, 'Last name is too short'),
    address: z.string().min(5, 'Address is too short'),
    phoneNumber: z.string().min(10, 'Phone number is too short'),
    // Role specific fields
    licenseNumber: z.string().optional(),
    licenseExpiryDate: z.string().optional(),
    staffId: z.string().optional(),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentDetails: any;
    userRole: string;
}

export const EditProfileModal = ({ isOpen, onClose, currentDetails, userRole }: EditProfileModalProps) => {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<EditProfileForm>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            firstName: currentDetails?.firstName || '',
            lastName: currentDetails?.lastName || '',
            address: currentDetails?.address || '',
            phoneNumber: currentDetails?.phoneNumber || '',
            licenseNumber: currentDetails?.driverProfile?.licenseNumber || '',
            licenseExpiryDate: currentDetails?.driverProfile?.licenseExpiryDate ? new Date(currentDetails.driverProfile.licenseExpiryDate).toISOString().split('T')[0] : '',
            staffId: currentDetails?.adminProfile?.staffId || '',
        }
    });

    useEffect(() => {
        if (isOpen && currentDetails) {
            reset({
                firstName: currentDetails.firstName || '',
                lastName: currentDetails.lastName || '',
                address: currentDetails.address || '',
                phoneNumber: currentDetails.phoneNumber || '',
                licenseNumber: currentDetails.driverProfile?.licenseNumber || '',
                licenseExpiryDate: currentDetails.driverProfile?.licenseExpiryDate ? new Date(currentDetails.driverProfile.licenseExpiryDate).toISOString().split('T')[0] : '',
                staffId: currentDetails.adminProfile?.staffId || '',
            });
        }
    }, [isOpen, currentDetails, reset]);

    const mutation = useMutation({
        mutationFn: (data: EditProfileForm) => authService.updateUserDetails({
            ...data,
            role: userRole
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userDetails'] });
            onClose();
        },
    });

    const onSubmit = (data: EditProfileForm) => {
        mutation.mutate(data);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-500" />
                                Edit Profile
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            {...register('firstName')}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm"
                                            placeholder="First Name"
                                        />
                                    </div>
                                    {errors.firstName && <p className="text-red-500 text-xs ml-1">{errors.firstName.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            {...register('lastName')}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm"
                                            placeholder="Last Name"
                                        />
                                    </div>
                                    {errors.lastName && <p className="text-red-500 text-xs ml-1">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        {...register('phoneNumber')}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm"
                                        placeholder="Phone Number"
                                    />
                                </div>
                                {errors.phoneNumber && <p className="text-red-500 text-xs ml-1">{errors.phoneNumber.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Physical Address
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        {...register('address')}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm"
                                        placeholder="Physical Address"
                                    />
                                </div>
                                {errors.address && <p className="text-red-500 text-xs ml-1">{errors.address.message}</p>}
                            </div>

                            {/* Driver Specific Fields */}
                            {userRole === 'Driver' && (
                                <div className="pt-2 grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                            License Number
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                {...register('licenseNumber')}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm"
                                                placeholder="License Number"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                            License Expiry
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                {...register('licenseExpiryDate')}
                                                type="date"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Admin Specific Fields */}
                            {(userRole === 'Admin' || userRole === 'SuperAdmin') && (
                                <div className="space-y-1.5 pt-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        Staff ID
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            {...register('staffId')}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm"
                                            placeholder="Staff ID"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                >
                                    {mutation.isPending ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5" />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
