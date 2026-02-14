import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Phone, MapPin, Shield, Camera, Loader2, Settings, Briefcase } from 'lucide-react';
import { useRef } from 'react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

export const ProfilePage = () => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: userDetails, isLoading } = useQuery({
        queryKey: ['userDetails'],
        queryFn: authService.getUserDetails,
        enabled: !!user,
    });

    const uploadMutation = useMutation({
        mutationFn: authService.uploadProfilePicture,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userDetails'] });
            alert('Profile picture updated successfully!');
        },
        onError: (error: any) => {
            alert('Failed to upload profile picture');
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadMutation.mutate(file);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    const detailItems = [
        { label: 'First Name', value: userDetails?.firstName || '-', icon: User },
        { label: 'Last Name', value: userDetails?.lastName || '-', icon: User },
        { label: 'Username', value: userDetails?.username || '-', icon: User },
        { label: 'Email Address', value: userDetails?.email || '-', icon: Mail },
        { label: 'Phone Number', value: userDetails?.phoneNumber || '-', icon: Phone },
        { label: 'Physical Address', value: userDetails?.address || 'Not specified', icon: MapPin },
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8 flex items-end gap-6">
                <div className="relative group">
                    <div className="size-32 rounded-3xl bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center group-hover:border-blue-500/50 transition-all">
                        {userDetails?.profilePicture ? (
                            <img src={userDetails.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-slate-600" />
                        )}
                        {uploadMutation.isPending && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadMutation.isPending}
                        className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 rounded-xl border-4 border-[#020617] text-white hover:bg-blue-500 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold text-white">{userDetails?.firstName} {userDetails?.lastName}</h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user?.role === 'Owner' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                            {user?.role}
                        </span>
                    </div>
                    <p className="text-slate-400 font-medium">@{userDetails?.username}</p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all font-semibold text-sm">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Account Details</h2>
                    </div>

                    <div className="space-y-5">
                        {detailItems.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                                    <item.icon className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                                    <p className="text-slate-200 font-medium">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-8 rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Briefcase className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Contact Info</h2>
                    </div>

                    <div className="space-y-5">
                        {detailItems.slice(3).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                                    <item.icon className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                                    <p className="text-slate-200 font-medium">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
