import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Car,
    Hash,
    Palette,
    Loader2,
    Camera,
    Image as ImageIcon
} from 'lucide-react';
import { vehicleService } from '@/services/vehicleService';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { Vehicle, VehicleToUpdate } from '@/types';
import toast from 'react-hot-toast';

const vehicleSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    brand: z.string().min(2, 'Brand is required'),
    model: z.string().min(1, 'Model is required'),
    plateNumber: z.string().min(3, 'Plate number is required'),
    color: z.string().min(2, 'Color is required'),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface EditVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle | null;
}

export const EditVehicleModal = ({ isOpen, onClose, vehicle }: EditVehicleModalProps) => {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
    });

    useEffect(() => {
        if (vehicle && isOpen) {
            reset({
                name: vehicle.name || (vehicle as any).Name || '',
                brand: vehicle.brand || (vehicle as any).Brand || '',
                model: vehicle.model || (vehicle as any).Model || '',
                plateNumber: vehicle.plateNumber || (vehicle as any).PlateNumber || '',
                color: vehicle.color || (vehicle as any).Color || '',
            });

            // Handle existing picture
            const picture = vehicle.picture || (vehicle as any).Picture;
            if (picture) {
                if (typeof picture === 'string') {
                    setPreviewUrl(picture);
                } else {
                    setPreviewUrl(picture.url || picture.Url);
                }
            } else {
                setPreviewUrl(null);
            }
        }
    }, [vehicle, isOpen, reset]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateMutation = useMutation({
        mutationFn: async (data: VehicleToUpdate) => {
            if (!vehicle) throw new Error('No vehicle selected');

            await vehicleService.updateVehicle(vehicle.id || (vehicle as any).Id, data);

            if (selectedFile) {
                setIsUploading(true);
                try {
                    await vehicleService.uploadVehiclePicture(vehicle.id || (vehicle as any).Id, selectedFile);
                } catch (error) {
                    console.error('Failed to upload vehicle picture', error);
                    toast.error('Vehicle updated but picture upload failed.');
                } finally {
                    setIsUploading(false);
                }
            }
        },
        onSuccess: () => {
            toast.success('Vehicle updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['all-vehicles'] });
            queryClient.invalidateQueries({ queryKey: ['my-fleet'] });
            handleClose();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update vehicle');
        }
    });

    const handleClose = () => {
        onClose();
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsUploading(false);
    };

    const onSubmit = (data: VehicleFormValues) => {
        if (!vehicle) return;

        const payload: VehicleToUpdate = {
            ...data,
        };
        updateMutation.mutate(payload);
    };

    if (!vehicle) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#1e293b] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-xl text-primary">
                                    <Car className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Edit Vehicle</h3>
                                    <p className="text-sm text-slate-400">Update details for {vehicle.name || (vehicle as any).Name}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Image Upload Area */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Picture</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`
                                        relative group cursor-pointer aspect-video rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden
                                        ${previewUrl ? 'border-primary/50 bg-primary/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'}
                                    `}
                                >
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                                    <Camera className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 py-8">
                                            <div className="p-4 bg-slate-800 rounded-full text-slate-500 group-hover:text-primary transition-colors border border-slate-700">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-white mb-1">Click to upload photo</p>
                                                <p className="text-xs text-slate-500">Max size: 5MB (JPG, PNG)</p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                            <p className="text-xs font-bold text-white uppercase tracking-widest">Optimizing & Uploading...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

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
                            </div>

                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updateMutation.isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Update Vehicle
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
