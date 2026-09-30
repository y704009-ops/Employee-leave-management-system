import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const leaveTypeService = {
  getAll: async () => {
    return apiClient.get(ENDPOINTS.LEAVE_TYPES.BASE);
  },
  getActive: async () => {
    return apiClient.get(ENDPOINTS.LEAVE_TYPES.ACTIVE);
  },
  getById: async (id) => {
    return apiClient.get(ENDPOINTS.LEAVE_TYPES.BY_ID(id));
  },
  create: async (data) => {
    return apiClient.post(ENDPOINTS.LEAVE_TYPES.BASE, data);
  },
  update: async (id, data) => {
    return apiClient.put(ENDPOINTS.LEAVE_TYPES.BY_ID(id), data);
  },
  updateStatus: async (id, active) => {
    return apiClient.patch(ENDPOINTS.LEAVE_TYPES.STATUS(id), { active });
  },
};
