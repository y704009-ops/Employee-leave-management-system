import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const employeeService = {
  getAll: async (params = {}) => {
    return apiClient.get(ENDPOINTS.EMPLOYEES.BASE, { params });
  },
  getById: async (id) => {
    return apiClient.get(ENDPOINTS.EMPLOYEES.BY_ID(id));
  },
  create: async (data) => {
    return apiClient.post(ENDPOINTS.EMPLOYEES.BASE, data);
  },
  update: async (id, data) => {
    return apiClient.put(ENDPOINTS.EMPLOYEES.BY_ID(id), data);
  },
  updateStatus: async (id, active) => {
    return apiClient.patch(ENDPOINTS.EMPLOYEES.STATUS(id), { active });
  },
};
