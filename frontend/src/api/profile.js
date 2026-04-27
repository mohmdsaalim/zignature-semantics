import apiClient from './client';

export const profileApi = {
  getProfile: async () => {
    const response = await apiClient.get('/profile/me/');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.patch('/profile/me/', data);
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await apiClient.post('/profile/me/upload/resume/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteResume: async () => {
    const response = await apiClient.delete('/profile/me/upload/resume/');
    return response.data;
  },

  uploadCoverLetter: async (file) => {
    const formData = new FormData();
    formData.append('cover_letter', file);
    const response = await apiClient.post('/profile/me/upload/cover-letter/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCoverLetter: async () => {
    const response = await apiClient.delete('/profile/me/upload/cover-letter/');
    return response.data;
  },
};