import api from './axios';
import type { LoginResponse } from '../types';

export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/login', { email, password });
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/logout');
    },

    me: async () => {
        const response = await api.get('/me');
        return response.data;
    },
};
