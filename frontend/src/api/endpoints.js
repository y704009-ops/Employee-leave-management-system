export const ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
  },
  USERS: {
    ME: '/users/me',
  },
  EMPLOYEES: {
    BASE: '/employees',
    BY_ID: (id) => `/employees/${id}`,
    STATUS: (id) => `/employees/${id}/status`,
  },
  DEPARTMENTS: {
    BASE: '/departments',
    BY_ID: (id) => `/departments/${id}`,
    EMPLOYEES: (id) => `/departments/${id}/employees`,
  },
  LEAVE_TYPES: {
    BASE: '/leave-types',
    ACTIVE: '/leave-types/active',
    BY_ID: (id) => `/leave-types/${id}`,
    STATUS: (id) => `/leave-types/${id}/status`,
  },
  BALANCES: {
    BASE: '/leave-balances',
    BY_ID: (id) => `/leave-balances/${id}`,
    BY_EMPLOYEE: (employeeId) => `/leave-balances/employee/${employeeId}`,
  },
  LEAVES: {
    BASE: '/leave-requests',
    MY: '/leave-requests/my',
    BY_ID: (id) => `/leave-requests/${id}`,
    CANCEL: (id) => `/leave-requests/${id}/cancel`,
    PENDING: '/leave-requests/pending',
    APPROVE: (id) => `/leave-requests/${id}/approve`,
    REJECT: (id) => `/leave-requests/${id}/reject`,
    REVIEW_DETAILS: (id) => `/leave-requests/${id}/review-details`,
    TEAM: '/leave-requests/team',
    TEAM_DASHBOARD: '/leave-requests/team-dashboard',
    BALANCE: (employeeId) => `/leave-balances/employee/${employeeId}`,
  },
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    SUMMARY: '/reports/summary',
    EXPORT_CSV: '/reports/export-csv',
  },
};
