import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 数据集服务
export const datasetService = {
  getAll: () => api.get('/api/datasets').then(res => res.data),
  getById: (id: string) => api.get(`/api/datasets/${id}`).then(res => res.data),
  create: (data: any) => api.post('/api/datasets', data).then(res => res.data),
  update: (id: string, data: any) => api.put(`/api/datasets/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/api/datasets/${id}`).then(res => res.data),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  }
};

// 可视化服务
export const visualizationService = {
  getAll: () => api.get('/api/visualizations').then(res => res.data),
  getById: (id: string) => api.get(`/api/visualizations/${id}`).then(res => res.data),
  create: (data: any) => api.post('/api/visualizations', data).then(res => res.data),
  update: (id: string, data: any) => api.put(`/api/visualizations/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/api/visualizations/${id}`).then(res => res.data),
};

// 分析服务
export const analyticsService = {
  executeQuery: (query: any) => api.post('/api/analytics/query', query).then(res => res.data),
  getSavedQueries: () => api.get('/api/analytics/saved-queries').then(res => res.data),
  saveQuery: (query: any) => api.post('/api/analytics/saved-queries', query).then(res => res.data),
};

// 认证服务
export const authService = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/api/auth/login', credentials).then(res => res.data),
  register: (userData: { email: string; password: string; name: string }) => 
    api.post('/api/auth/register', userData).then(res => res.data),
  logout: () => api.post('/api/auth/logout').then(res => res.data),
  getProfile: () => api.get('/api/auth/profile').then(res => res.data),
};

export default api;