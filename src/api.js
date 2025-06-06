import axios from 'axios';
import router from './router';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      router.push('/signin');
    }
    return Promise.reject(error);
  }
);

export default api;