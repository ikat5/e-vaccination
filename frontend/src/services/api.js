import axios from 'axios';

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
      error.message = 'Network error. Please check if the backend server is running.';
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// User APIs
export const userAPI = {
  signup: (data) => api.post('/user/signup', data),
  login: (data) => api.post('/user/login', data),
  logout: (data) => api.post('/user/logout', data),
};

// Vaccine APIs
export const vaccineAPI = {
  scheduleFirstDose: (data) => api.post('/vaccine/first-dose', data),
  scheduleNextDose: (data) => api.post('/vaccine/next-dose', data),
  getVaccineCard: (data) => api.post('/vaccine/card', data),
};

// Staff APIs
export const staffAPI = {
  login: (data) => api.post('/staff/login', data),
  logout: (data) => api.post('/staff/logout', data),
  getAssignedVaccine: (data) => api.get('/staff/assigned', { params: data }),
  updateQuantity: (data) => api.patch('/staff/update-quantity', data),
  administerVaccine: (data) => api.post('/staff/administer', data),
  getStats: (data) => api.get('/staff/stats', { params: data }),
  getUserByBirthId: (data) => api.post('/staff/get-user', data),
};

// Admin APIs
export const adminAPI = {
  signup: (data) => api.post('/admin/signup', data),
  login: (data) => api.post('/admin/login', data),
  logout: (data) => api.post('/admin/logout', data),
  createStaff: (data) => api.post('/admin/create-staff', data),
  updateStock: (data) => api.post('/admin/update-stock', data),
  assignVaccine: (data) => api.post('/admin/assign-vaccine', data),
  getStock: (data) => api.post('/admin/get-stock', data),
  getStaff: (data) => api.post('/admin/get-staff', data),
};
export default api;

