import { create } from 'zustand';
import { authApi } from '../api/auth';

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
  isLoggingOut: false,

  _setAuth: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      loading: false,
      error: null,
    }),

  _clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      isLoggingOut: false,
    }),

  setAccessToken: (token) => set({ accessToken: token }),

  clearError: () => set({ error: null }),

  initAuth: async () => {
    if (get().isInitialized) return;

    try {
      const { access } = await authApi.refreshToken();
      set({ accessToken: access });

      const user = await authApi.getUser();
      get()._setAuth(user, access);
    } catch {
      get()._clearAuth();
    } finally {
      set({ isInitialized: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.login(email, password);
      get()._setAuth(data.user, data.access);
      return data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Invalid email or password.';
      set({ loading: false, error: message });
      throw error;
    }
  },

  register: async (email, username, password, passwordConfirm) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.register(email, username, password, passwordConfirm);
      get()._setAuth(data.user, data.access);
      return data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed.';
      set({ loading: false, error: message });
      throw error;
    }
  },

  googleLogin: async (idToken) => {
    set({ loading: true, error: null });
    try {
      const data = await authApi.googleLogin(idToken);
      get()._setAuth(data.user, data.access);
      return data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Google sign-in failed.';
      set({ loading: false, error: message });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await authApi.logout();
    } catch {
    } finally {
      get()._clearAuth();
    }
  },

  refreshToken: async () => {
    const { access } = await authApi.refreshToken();
    set({ accessToken: access });
    return access;
  },
}));

export { useAuthStore };
export default useAuthStore;