import apiClient from './client';

export const authApi = {
  register: async (email, username, password, passwordConfirm) => {
    const response = await apiClient.post('/auth/register/', {
      email,
      username,
      password,
      password_confirm: passwordConfirm,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login/', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout/');
    return response.data;
  },

  getUser: async () => {
    const response = await apiClient.get('/auth/user/');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword, newPasswordConfirm) => {
    const response = await apiClient.post('/auth/password/change/', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
    return response.data;
  },

  googleLogin: async (idToken) => {
    const response = await apiClient.post('/auth/google/', {
      id_token: idToken,
    });
    return response.data;
  },
};