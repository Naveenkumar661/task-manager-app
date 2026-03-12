import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token on 401
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const { data } = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
        localStorage.setItem('access_token', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return API(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const register = (data) => API.post('/register/', data);
export const login = (data) => API.post('/login/', data);
export const logout = (data) => API.post('/logout/', data);
export const getProfile = () => API.get('/profile/');

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const getTasks = (params) => API.get('/tasks/', { params });
export const getTask = (id) => API.get(`/tasks/${id}/`);
export const createTask = (data) => API.post('/tasks/', data);
export const updateTask = (id, data) => API.patch(`/tasks/${id}/`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}/`);
export const getTaskStats = () => API.get('/tasks/stats/');

export default API;
