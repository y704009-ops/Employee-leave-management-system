import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const leaveService = {
  applyLeave: async (leaveData) => {
    return apiClient.post(ENDPOINTS.LEAVES.BASE, leaveData);
  },
  getMyLeaves: async (params = {}) => {
    return apiClient.get(ENDPOINTS.LEAVES.MY, { params });
  },
  getById: async (id) => {
    return apiClient.get(ENDPOINTS.LEAVES.BY_ID(id));
  },
  cancelLeave: async (id) => {
    return apiClient.patch(ENDPOINTS.LEAVES.CANCEL(id));
  },
  getPendingLeaves: async (params = {}) => {
    return apiClient.get(ENDPOINTS.LEAVES.PENDING, { params });
  },
  approveLeave: async (id, comment = '') => {
    return apiClient.patch(ENDPOINTS.LEAVES.APPROVE(id), { comment });
  },
  rejectLeave: async (id, comment = '') => {
    return apiClient.patch(ENDPOINTS.LEAVES.REJECT(id), { comment });
  },
  getReviewDetails: async (id) => {
    return apiClient.get(ENDPOINTS.LEAVES.REVIEW_DETAILS(id));
  },
  getTeamLeaves: async (params = {}) => {
    return apiClient.get(ENDPOINTS.LEAVES.TEAM, { params });
  },
  getTeamDashboardStats: async () => {
    return apiClient.get(ENDPOINTS.LEAVES.TEAM_DASHBOARD);
  },
};
