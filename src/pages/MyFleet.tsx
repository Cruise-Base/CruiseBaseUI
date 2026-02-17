import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/vehicleService';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { Loader2, MapPin, Car, Navigation, ShieldCheck } from 'lucide-react';

export const MyFleetPage = () => {
    const { user } = useAuthStore();

    const { data: userDetails } = useQuery({
        queryKey: ['userDetails'],
        queryFn: authService.getUserDetails,
        enabled: !!user,
    });

    const effectiveUserId = userDetails?.id || (userDetails as any)?.Id || user?.id;

    const { data: vehicles, isLoading, isError, error } = useQuery({
        queryKey: ['my-fleet', effectiveUserId],
        queryFn: async () => {
            console.log('Fetching fleet for user:', effectiveUserId);
            const data = await vehicleService.getVehiclesByUserId(effectiveUserId!);
            console.log('Fetched vehicles:', data);
            return data;
        },
        enabled: !!effectiveUserId,
    });

    console.log('MyFleet data:', { vehicles, isLoading, isError, error });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="p-4 bg-red-500/10 rounded-full mb-4">
                    <ShieldCheck className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Failed to load fleet</h3>
                <p className="text-slate-500">
                    {error instanceof Error ? error.message : 'There was an error fetching your vehicles.'}
                </p>
            </div>
        );
    }

    const getVehicleList = (data: any): any[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (data.data && Array.isArray(data.data)) return data.data;
        if (data.Data && Array.isArray(data.Data)) return data.Data;
        return [];
    };

    const vehicleList = getVehicleList(vehicles);
    const activeVehicles = vehicleList.filter(v => v.isActive || v.IsActive);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white">My Fleet</h2>
                <p className="text-sm text-slate-500">Real-time status and location of your registered vehicles</p>
            </div>

            {/* Placeholder Map Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-[400px] w-full bg-[#1e293b]/50 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-sm">
                    {/* Simulated Map Background */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}></div>
                        {/* Mock City Grid Lines */}
                        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-white/10 rotate-12"></div>
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -rotate-6"></div>
                        <div className="absolute top-0 left-1/3 w-[1px] h-full bg-white/10 rotate-3"></div>
                        <div className="absolute top-0 left-2/3 w-[1px] h-full bg-white/10 -rotate-12"></div>
                    </div>

                    {/* Mock Vehicle Pins */}
                    <div className="absolute top-1/3 left-1/4 animate-bounce duration-2000">
                        <div className="relative">
                            <MapPin className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                            <div className="absolute top-0 left-full ml-2 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-white whitespace-nowrap">
                                CB-001 (Active)
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-1/4 right-1/3 animate-bounce [animation-delay:500ms] duration-3000">
                        <div className="relative">
                            <MapPin className="w-8 h-8 text-secondary shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                            <div className="absolute top-0 left-full ml-2 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-white whitespace-nowrap">
                                CB-042 (In Transit)
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-1/2 right-1/4 animate-bounce [animation-delay:1000ms] duration-2500">
                        <div className="relative">
                            <MapPin className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                            <div className="absolute top-0 left-full ml-2 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-white whitespace-nowrap">
                                CB-015 (Idle)
                            </div>
                        </div>
                    </div>

                    {/* Map UI Elements */}
                    <div className="absolute top-6 left-6 flex gap-2">
                        <div className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-3">
                            <Navigation className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-white tracking-wide">LEGOS, NIGERIA</span>
                        </div>
                        <div className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-primary/20 flex items-center justify-center">
                                    <Car className="w-3 h-3 text-primary" />
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-secondary/20 flex items-center justify-center">
                                    <Car className="w-3 h-3 text-secondary" />
                                </div>
                            </div>
                            <span className="text-xs font-bold text-white tracking-wide">{vehicleList.length} VEHICLES</span>
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6">
                        <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            LIVE TELEMETRY ACTIVE
                        </div>
                    </div>

                    {/* Map Instructions */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center space-y-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                                <MapPin className="w-8 h-8 text-primary" />
                            </div>
                            <h4 className="text-lg font-bold text-white">Live Tracking Placeholder</h4>
                            <p className="text-sm text-slate-400 max-w-md">Integrate with Google Maps or Mapbox API for real-time fleet positioning and geofencing.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vehicle Grid Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Car className="w-6 h-6 text-primary" />
                    Fleet List
                </h3>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400">
                        {vehicleList.length} TOTAL
                    </span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary">
                        {activeVehicles.length} ACTIVE
                    </span>
                </div>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicleList.map((vehicle) => (
                    <VehicleCard key={vehicle.id || vehicle.Id} vehicle={vehicle} />
                ))}
            </div>

            {vehicleList.length === 0 && (
                <div className="bg-[#1e293b]/30 border border-dashed border-slate-800 rounded-[2rem] p-12 text-center">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Car className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-bold text-white">No vehicles found</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">
                        You haven't added any vehicles to your fleet yet. Click 'Add Vehicle' on your dashboard to get started.
                    </p>
                </div>
            )}
        </div>
    );
};
