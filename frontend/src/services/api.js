import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const cropAPI = {
  getAllCrops: () => api.get('/crops/'),
  getCropDetails: (id) => api.get(`/crops/${id}/`),
  getCropCareInstructions: (id) => api.get(`/crops/${id}/care/`),
  predictCrops: (data) => api.post('/predict/', data),
  getPredictionHistory: () => api.get('/my-predictions/'),
};

export default api;