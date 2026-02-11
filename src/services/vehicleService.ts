import { api } from './api';
import type { Vehicle, ContractProgress } from '../types';

export const vehicleService = {
    getVehicles: async (): Promise<Vehicle[]> => {
        const response = await api.get('/api/vehicle');
        return response.data;
    },

    getVehicleById: async (id: string): Promise<Vehicle> => {
        const response = await api.get(`/api/vehicle/${id}`);
        return response.data;
    },

    createVehicle: async (data: any): Promise<Vehicle> => {
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
};
