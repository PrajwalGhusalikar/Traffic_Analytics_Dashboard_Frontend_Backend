import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;
    if (status === 404) console.warn('Not found:', error.config?.url);
    if (status >= 500)  console.error('Server error:', detail);
    return Promise.reject(error);
  }
);

export default api;
