import { http } from '@/lib/http'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  username: string
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
    http.post<AuthResponse>('/api/auth/login', credentials),
    
  register: (data: RegisterCredentials) =>
    http.post<AuthResponse>('/api/auth/register', data),
    
  logout: () => 
    http.post('/api/auth/logout'),
  
  me: () => 
    http.get('/api/auth/profile'),
}