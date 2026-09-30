import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const reportService = {
  getAdminDashboard: async () => {
    return apiClient.get(ENDPOINTS.REPORTS.DASHBOARD);
  },

  getSummary: async (params = {}) => {
    return apiClient.get(ENDPOINTS.REPORTS.SUMMARY, { params });
  },

  exportCsv: async (params = {}) => {
    return apiClient.get(ENDPOINTS.REPORTS.EXPORT_CSV, {
      params,
      responseType: 'blob',
    });
  },
};
