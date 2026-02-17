export type UserRole = 'SuperAdmin' | 'Admin' | 'Owner' | 'Driver';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    fullName: string;
    profilePicture?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: UserRole | number;
}

export interface Wallet {
    id: string;
    balance: number;
    currency: string;
    isPinSet: boolean;
}

export interface Transaction {
    id: string;
    amount: number;
    type: 'Commission' | 'Collection' | 'Withdrawal' | 'Split';
    status: 'Pending' | 'Completed' | 'Failed';
    createdAt: string;
    description: string;
}

export interface Vehicle {
    id: string;
    name: string;
    brand?: string;
    model?: string;
    plateNumber: string;
    color: string;
    isActive: boolean;
    contractType?: string;
    tenure?: number;
    paymentAmount?: number;
    paymentFrequency?: string;
    startDate?: string;
    picture?: string | {
        url: string;
        publicId: string;
    };
}

export interface VehicleToCreate {
    name: string;
    brand: string;
    model: string;
    plateNumber: string;
    color: string;
    userId?: string;
    ownerPercentage?: number;
}

export interface ContractProgress {
    vehicleId: string;
    totalValue: number;
    paidAmount: number;
    percentage: number;
    remainingAmount: number;
}
