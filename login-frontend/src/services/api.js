import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (userData) => api.post('/register', userData),
  googleLogin: (credential) => api.post('/auth/google', { credential }),
};

// Users API
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  getUsersByRole: (role) => api.get(`/users/role/${role}`),
  getWorkersByType: (workerType) => api.get(`/users/workers/${workerType}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  searchUsers: (keyword) => api.get(`/users/search?keyword=${keyword}`),
};

// Venues API
export const venuesAPI = {
  getAllVenues: () => api.get('/venues'),
  getVenueById: (id) => api.get(`/venues/${id}`),
  createVenue: (venueData) => api.post('/venues', venueData),
  updateVenue: (id, venueData) => api.put(`/venues/${id}`, venueData),
  deleteVenue: (id) => api.delete(`/venues/${id}`),
  getVenuesByType: (type) => api.get(`/venues/type/${type}`),
  searchVenues: (keyword) => api.get(`/venues/search?keyword=${keyword}`),
  getVenuesByBuilding: (building) => api.get(`/venues/building/${building}`),
};

// Queries API
export const queriesAPI = {
  getAllQueries: () => api.get('/queries'),
  getQueryById: (id) => api.get(`/queries/${id}`),
  createQuery: (queryData) => api.post('/queries', queryData),
  getQueriesByUser: (userId) => api.get(`/queries/user/${userId}`),
  getQueriesByWorker: (workerId) => api.get(`/queries/worker/${workerId}`),
  getQueriesByStatus: (status) => api.get(`/queries/status/${status}`),
  getQueriesByVenue: (venueId) => api.get(`/queries/venue/${venueId}`),
  searchQueries: (params) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/queries/search?${queryParams}`);
  },
  assignQuery: (queryId, workerId) => api.put(`/queries/${queryId}/assign/${workerId}`),
  updateQueryStatus: (queryId, status) => api.put(`/queries/${queryId}/status/${status}`),
  deleteQuery: (id) => api.delete(`/queries/${id}`),
  getQueryStats: () => api.get('/queries/stats'),
  createQueryWithImage: (formData) => {
    return axios.post(`${API_BASE_URL}/queries/with-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Files API
export const filesAPI = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getFileUrl: (filename) => `${API_BASE_URL}/files/${filename}`,
};

export default api;
