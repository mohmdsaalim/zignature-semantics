import { create } from 'zustand';
import { authApi } from '../api/auth';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setAccessToken: (token) => set({ accessToken: token }),
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.login(email, password);
      set({
        accessToken: data.access,
        user: data.user,
        isAuthenticated: true,
        loading: false,
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  register: async (email, username, password, passwordConfirm) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.register(email, username, password, passwordConfirm);
      set({
        accessToken: data.access,
        user: data.user,
        isAuthenticated: true,
        loading: false,
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  googleLogin: async (idToken) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.googleLogin(idToken);
      set({
        accessToken: data.access,
        user: data.user,
        isAuthenticated: true,
        loading: false,
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Google login failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // If 401, cookie is already invalid/expired - that's fine, just clear local state
      if (error.response?.status !== 401) {
        console.error('Logout error:', error);
      }
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const data = await authApi.getUser();
      set({ user: data, isAuthenticated: true, loading: false });
      return data;
    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));