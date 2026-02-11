import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    role: 'SuperAdmin' | 'Admin' | 'Owner' | 'Driver';
    fullName: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setCredentials: (accessToken: string, refreshToken: string) => void;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            setCredentials: (accessToken, refreshToken) =>
                set({ accessToken, refreshToken, isAuthenticated: true }),
            setUser: (user) => set({ user }),
            logout: () =>
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
