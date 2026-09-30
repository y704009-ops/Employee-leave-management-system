import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const departmentService = {
  getAll: async () => {
    return apiClient.get(ENDPOINTS.DEPARTMENTS.BASE);
  },
  getById: async (id) => {
    return apiClient.get(ENDPOINTS.DEPARTMENTS.BY_ID(id));
  },
  create: async (data) => {
    return apiClient.post(ENDPOINTS.DEPARTMENTS.BASE, data);
  },
  update: async (id, data) => {
    return apiClient.put(ENDPOINTS.DEPARTMENTS.BY_ID(id), data);
  },
  getEmployees: async (id) => {
    return apiClient.get(ENDPOINTS.DEPARTMENTS.EMPLOYEES(id));
  },
  assignEmployees: async (id, employeeIds) => {
    return apiClient.post(ENDPOINTS.DEPARTMENTS.EMPLOYEES(id), { employeeIds });
  },
};
