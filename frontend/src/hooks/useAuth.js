import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    isAuthenticated,
    isInitialized,
    loading,
    error,
    login,
    register,
    logout,
    googleLogin,
    clearError,
  } = useAuthStore();

  const handleLogin = useCallback(
    async (email, password, redirectTo = '/profile') => {
      await login(email, password);
      const from = location.state?.from || redirectTo;
      navigate(from, { replace: true });
    },
    [login, navigate, location]
  );

  const handleRegister = useCallback(
    async (email, username, password, passwordConfirm, redirectTo = '/profile') => {
      await register(email, username, password, passwordConfirm);
      navigate(redirectTo, { replace: true });
    },
    [register, navigate]
  );

  const handleGoogleLogin = useCallback(
    async (idToken, redirectTo = '/profile') => {
      await googleLogin(idToken);
      const from = location.state?.from || redirectTo;
      navigate(from, { replace: true });
    },
    [googleLogin, navigate, location]
  );

  const handleLogout = useCallback(
    async (redirectTo = '/') => {
      await logout();
      navigate(redirectTo, { replace: true });
    },
    [logout, navigate]
  );

  const requireAuth = useCallback(
    (redirectTo = '/login') => {
      if (!isInitialized) return true;
      if (!isAuthenticated) {
        navigate(redirectTo, { state: { from: location.pathname }, replace: true });
        return false;
      }
      return true;
    },
    [isAuthenticated, isInitialized, navigate, location]
  );

  const requireGuest = useCallback(
    (redirectTo = '/profile') => {
      if (!isInitialized) return true;
      if (isAuthenticated) {
        navigate(redirectTo, { replace: true });
        return false;
      }
      return true;
    },
    [isAuthenticated, isInitialized, navigate]
  );

  return {
    user,
    isAuthenticated,
    isInitialized,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    googleLogin: handleGoogleLogin,
    clearError,
    requireAuth,
    requireGuest,
  };
};