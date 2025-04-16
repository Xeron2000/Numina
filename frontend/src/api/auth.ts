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
    apiClient.post<AuthResponse>('/api/v1/auth/login', credentials),
    
  register: (data: LoginCredentials) =>
    apiClient.post<AuthResponse>('/api/v1/auth/register', data),
    
  logout: () => 
    apiClient.post('/api/v1/auth/logout'),
  
  me: () => 
    apiClient.get('/api/v1/auth/profile'),
}