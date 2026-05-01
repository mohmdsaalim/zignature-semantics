import apiClient from './client';

export const careersApi = {
  getJobs: async (params = {}) => {
    const response = await apiClient.get('/careers/jobs/', { params });
    return response.data;
  },
  getJobBySlug: async (slug) => {
    const response = await apiClient.get(`/careers/jobs/${slug}/`);
    return response.data;
  },
  getCompanies: async (params = {}) => {
    const response = await apiClient.get('/careers/companies/', { params });
    return response.data;
  },
};
