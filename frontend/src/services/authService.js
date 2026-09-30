import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const authService = {
  login: async (credentials) => {
    return apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
  },
  logout: async () => {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },
  getCurrentUser: async () => {
    return apiClient.get(ENDPOINTS.USERS.ME);
  },
};
