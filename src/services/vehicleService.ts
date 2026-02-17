import { api } from './api';
import type { Vehicle, ContractProgress, VehicleToCreate } from '../types';

export const vehicleService = {
    getVehicles: async (): Promise<Vehicle[]> => {
        const response = await api.get('/api/vehicle');
        const data = response.data;
        return data.data || data.Data || (Array.isArray(data) ? data : []);
    },

    getVehiclesByUserId: async (userId: string): Promise<Vehicle[]> => {
        const response = await api.get(`/api/vehicle/byuserid/${userId}`);
        const data = response.data;
        return data.data || data.Data || (Array.isArray(data) ? data : []);
    },

    getVehicleById: async (id: string): Promise<Vehicle> => {
        const response = await api.get(`/api/vehicle/${id}`);
        const data = response.data;
        return data.data || data.Data || data;
    },

    createVehicle: async (data: VehicleToCreate): Promise<Vehicle> => {
        const response = await api.post('/api/vehicle', data);
        return response.data;
    },

    getDriverProgress: async (vehicleId: string): Promise<ContractProgress> => {
        const response = await api.get(`/api/vehicle/${vehicleId}/progress/driver`);
        return response.data;
    },

    getOwnerProgress: async (vehicleId: string): Promise<ContractProgress> => {
        const response = await api.get(`/api/vehicle/${vehicleId}/progress/owner`);
        return response.data;
    },

    createContract: async (data: any): Promise<void> => {
        await api.post('/api/contract', data);
    },

    uploadVehiclePicture: async (vehicleId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/api/vehicle/${vehicleId}/picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
