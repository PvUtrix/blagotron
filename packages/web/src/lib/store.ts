import { create } from 'zustand';
import { api } from './api';

interface User {
  id: string;
  email: string;
  profile: {
    displayName: string;
    timezone: string;
    language: string;
    preferences: any;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, accessToken, refreshToken) => {
    api.setToken(accessToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    api.setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        api.setToken(token);
        try {
          const response = await api.getCurrentUser();
          if (response.success) {
            set({
              user: response.data,
              accessToken: token,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
    }
    set({ isLoading: false });
  },
}));
