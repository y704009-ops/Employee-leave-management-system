import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const balanceService = {
  getAll: async (year) => {
    return apiClient.get(ENDPOINTS.BALANCES.BASE, { params: year ? { year } : {} });
  },
  getByEmployeeId: async (employeeId, year) => {
    return apiClient.get(ENDPOINTS.BALANCES.BY_EMPLOYEE(employeeId), { params: year ? { year } : {} });
  },
  adjust: async (id, data) => {
    return apiClient.put(ENDPOINTS.BALANCES.BY_ID(id), data);
  },
};
