import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    googleLogin,
    fetchUser,
    clearError,
  } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = useAuthStore.getState().accessToken;
      if (token && !user) {
        try {
          await fetchUser();
        } catch (err) {
          console.error('Failed to fetch user:', err);
        }
      }
    };
    initAuth();
  }, []);

  const handleLogin = useCallback(
    async (email, password, redirectTo = '/') => {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    },
    [login, navigate]
  );

  const handleRegister = useCallback(
    async (email, username, password, passwordConfirm, redirectTo = '/') => {
      await register(email, username, password, passwordConfirm);
      navigate(redirectTo, { replace: true });
    },
    [register, navigate]
  );

  const handleGoogleLogin = useCallback(
    async (idToken, redirectTo = '/') => {
      await googleLogin(idToken);
      navigate(redirectTo, { replace: true });
    },
    [googleLogin, navigate]
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
      if (!isAuthenticated && !loading) {
        navigate(redirectTo, { state: { from: location.pathname }, replace: true });
        return false;
      }
      return true;
    },
    [isAuthenticated, loading, navigate, location]
  );

  const requireGuest = useCallback(
    (redirectTo = '/') => {
      if (isAuthenticated) {
        navigate(redirectTo, { replace: true });
        return false;
      }
      return true;
    },
    [isAuthenticated, navigate]
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    googleLogin: handleGoogleLogin,
    fetchUser,
    clearError,
    requireAuth,
    requireGuest,
  };
};