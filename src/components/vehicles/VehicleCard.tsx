import type { Vehicle } from '@/types';
import { Car, Fuel, Settings2, ShieldCheck, ChevronRight } from 'lucide-react';

interface VehicleCardProps {
    vehicle: Vehicle;
    onClick?: () => void;
}

export const VehicleCard = ({ vehicle, onClick }: VehicleCardProps) => {
    return (
        <div
            onClick={onClick}
            className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer group"
        >
            <div className="relative h-48 w-full bg-slate-900">
                {vehicle.pictures?.[0] ? (
                    <img
                        src={vehicle.pictures[0]}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-12 h-12 text-slate-700" />
                    </div>
                )}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                    {vehicle.licensePlate}
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                            {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-sm text-slate-500">{vehicle.registrationNumber}</p>
                    </div>
                    <div className="p-2 bg-secondary/10 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-secondary" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Fuel className="w-4 h-4" />
                        <span className="text-xs font-medium">Automatic</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Settings2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Hybrid</span>
                    </div>
                </div>

                <button className="w-full mt-6 flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-primary text-white rounded-xl transition-all group/btn font-semibold text-sm">
                    View Contract Details
                    <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
