import { api } from './api';
import type { User } from '../types';

export const userService = {
    searchUser: async (term: string): Promise<User> => {
        const response = await api.get(`/api/user/search?term=${encodeURIComponent(term)}`);
        return response.data;
    },
};
