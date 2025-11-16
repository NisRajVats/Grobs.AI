import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('grobs-ai-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email, password) =>
    api.post('/register/', { email, password }),

  login: (email, password) =>
    api.post('/token', new URLSearchParams({
      username: email,
      password: password,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }),

  getCurrentUser: () => api.get('/users/me'),
};

export const resumeAPI = {
  create: (resumeData) => api.post('/resume/', resumeData),
  getAll: () => api.get('/resumes/'),
  getById: (id) => api.get(`/resume/${id}`),
  update: (id, resumeData) => api.put(`/resume/${id}`, resumeData),
  delete: (id) => api.delete(`/resume/${id}`),
  analyze: (id, jobDescription) =>
    api.post(`/resume/${id}/analyze`, { text: jobDescription }),
};

export default api;
