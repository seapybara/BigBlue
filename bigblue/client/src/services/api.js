import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/updateprofile', data),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
  getFavorites: () => api.get('/auth/favorites'),
  addToFavorites: (locationId) => api.post(`/auth/favorites/${locationId}`),
  removeFromFavorites: (locationId) => api.delete(`/auth/favorites/${locationId}`),
};

// Location endpoints
export const locationAPI = {
  getAll: () => api.get('/locations'),
  getOne: (id) => api.get(`/locations/${id}`),
  getNearby: (lat, lng, distance) => 
    api.get(`/locations/nearby?lat=${lat}&lng=${lng}&distance=${distance}`),
  search: (query) => api.get(`/locations/search?q=${query}`),
};

// Buddy Request endpoints
export const buddyAPI = {
  create: (data) => api.post('/buddy-requests', data),
  getAll: (params) => api.get('/buddy-requests', { params }),
  getOne: (id) => api.get(`/buddy-requests/${id}`),
  getByLocation: (locationId) => api.get(`/buddy-requests/location/${locationId}`),
  getByDateRange: (start, end) => 
    api.get(`/buddy-requests/date-range?start=${start}&end=${end}`),
  update: (id, data) => api.put(`/buddy-requests/${id}`, data),
  respond: (id, response) => api.post(`/buddy-requests/${id}/respond`, response),
  accept: (id, responderId) => api.put(`/buddy-requests/${id}/accept/${responderId}`),
  reject: (id, responderId) => api.put(`/buddy-requests/${id}/reject/${responderId}`),
  delete: (id) => api.delete(`/buddy-requests/${id}`),
  join: (id) => api.post(`/buddy-requests/${id}/join`),
  sendRequest: (data) => api.post('/buddy-requests/send', data),
  getStats: () => api.get('/buddy-requests/stats'),
};

// User/Buddy endpoints for finding dive partners
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  search: (query) => api.get(`/users/search?q=${query}`),
};

// Dive endpoints
export const diveAPI = {
  create: (data) => api.post('/dives', data),
  getAll: () => api.get('/dives'),
  getMyDives: () => api.get('/dives/my-dives'),
  getOne: (id) => api.get(`/dives/${id}`),
  getByUser: (userId) => api.get(`/dives/user/${userId}`),
  update: (id, data) => api.put(`/dives/${id}`, data),
  delete: (id) => api.delete(`/dives/${id}`),
  getStats: () => api.get('/dives/stats'),
};


export default api;