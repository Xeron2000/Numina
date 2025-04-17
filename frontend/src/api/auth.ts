import { http } from '@/lib/http'

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
    http.post<AuthResponse>('/api/v1/auth/login', credentials),
    
  register: (data: LoginCredentials) =>
    http.post<AuthResponse>('/api/v1/auth/register', data),
    
  logout: () => 
    http.post('/api/v1/auth/logout'),
  
  me: () => 
    http.get('/api/v1/auth/profile'),
}