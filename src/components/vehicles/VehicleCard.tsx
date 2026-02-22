import type { Vehicle } from '@/types';
import { Car, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { vehicleService } from '@/services/vehicleService';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { EditVehicleModal } from './EditVehicleModal';

interface VehicleCardProps {
    vehicle: Vehicle;
    onClick?: () => void;
}

export const VehicleCard = ({ vehicle, onClick }: VehicleCardProps) => {
    const v = vehicle as any;
    const name = vehicle.name || v.Name || 'Unnamed Vehicle';
    const plateNumber = vehicle.plateNumber || v.PlateNumber || 'N/A';
    const picture = vehicle.picture || v.Picture;
    const vehicleId = vehicle.id || v.Id;

    const queryClient = useQueryClient();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                await vehicleService.deleteVehicle(vehicleId);
                toast.success('Vehicle deleted successfully');
                queryClient.invalidateQueries({ queryKey: ['my-fleet'] });
                queryClient.invalidateQueries({ queryKey: ['all-vehicles'] });
            } catch (error) {
                console.error('Failed to delete vehicle', error);
                toast.error('Failed to delete vehicle');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditModalOpen(true);
    };

    const getPictureUrl = () => {
        if (!picture) return null;
        if (typeof picture === 'string') return picture;
        return picture.url || picture.Url;
    };

    const pictureUrl = getPictureUrl();
    const isActive = vehicle.isActive || v.IsActive;

    const handleViewContract = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Determine if vehicle has a contract based on contractType or other available properties
        const hasContract = vehicle.contractType || v.ContractType;

        if (!hasContract || hasContract === 'None') {
            toast.error("This vehicle has no active contract");
            return;
        }

        toast('Contract details functionality coming soon', {
            icon: 'ℹ️',
        });
    };

    return (
        <div
            onClick={onClick}
            className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
        >
            <div className="relative h-48 w-full bg-slate-900">
                {pictureUrl ? (
                    <img
                        src={pictureUrl}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-12 h-12 text-slate-700" />
                    </div>
                )}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                    {plateNumber}
                </div>
                <div className={`absolute top-4 left-4 px-3 py-1 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 ${isActive ? 'bg-green-500/80' : 'bg-slate-500/80'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                            {name}
                        </h3>
                        <p className="text-sm text-slate-500">{plateNumber}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleEdit}
                            className="p-2 bg-slate-800 hover:bg-primary/20 rounded-xl transition-colors group/edit"
                            title="Edit Vehicle"
                        >
                            <Edit className="w-5 h-5 text-slate-400 group-hover/edit:text-primary transition-colors" />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2 bg-slate-800 hover:bg-red-500/20 rounded-xl transition-colors group/delete disabled:opacity-50"
                            title="Delete Vehicle"
                        >
                            <Trash2 className="w-5 h-5 text-slate-400 group-hover/delete:text-red-500 transition-colors" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleViewContract}
                    className="w-full mt-6 flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-primary text-white rounded-xl transition-all group/btn font-semibold text-sm"
                >
                    View Contract Details
                    <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>

            <EditVehicleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                vehicle={vehicle}
            />
        </div>
    );
};
