import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Injects Bearer token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('elms_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalizes API responses based on PRD schema & handles 401 centrally
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response?.status || 500;
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');

    // Central session expiry handler: if 401 on an authenticated call, dispatch unauthorized event
    if (status === 401 && !isLoginEndpoint) {
      localStorage.removeItem('elms_auth_token');
      localStorage.removeItem('elms_auth_user');
      window.dispatchEvent(new CustomEvent('elms:unauthorized', {
        detail: { message: error.response?.data?.error?.message || 'Session expired. Please log in again.' }
      }));
    }

    const customError = {
      success: false,
      status: status,
      code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.error?.message || error.message || 'An unexpected error occurred',
      details: error.response?.data?.error?.details || [],
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
