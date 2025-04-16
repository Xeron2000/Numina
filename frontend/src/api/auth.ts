import apiClient from './client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    email: string
    username: string
  }
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>('/api/auth/login', credentials),
    
  register: (data: LoginCredentials) =>
    apiClient.post<AuthResponse>('/api/auth/register', data),
    
  logout: () => apiClient.post('/api/auth/logout'),
  
  me: () => apiClient.get('/api/auth/me'),
}