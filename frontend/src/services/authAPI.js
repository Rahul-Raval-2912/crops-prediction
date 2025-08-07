import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const auth = {
  register: (userData) => authAPI.post('/register/', userData),
  login: (credentials) => authAPI.post('/login/', credentials),
  logout: () => authAPI.post('/logout/'),
  deleteAccount: () => authAPI.delete('/delete-account/'),
  getDashboard: () => authAPI.get('/dashboard/'),
  getMyPredictions: () => authAPI.get('/my-predictions/'),
};

export default authAPI;