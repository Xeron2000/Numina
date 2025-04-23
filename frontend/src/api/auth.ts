import { http } from '@/lib/http'
import Cookies from 'js-cookie'

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
  login: async (credentials: LoginCredentials) => {
    const response = await http.post<AuthResponse>('/api/auth/login', credentials) as unknown as AuthResponse
    Cookies.set('access_token', response.access_token, {
      path: '/',
      secure: true,
      sameSite: 'strict'
    })
    return response
  },
    
  register: (data: RegisterCredentials) =>
    http.post<AuthResponse>('/api/auth/register', data) as unknown as Promise<AuthResponse>,
    
  logout: () => 
    http.post('/api/auth/logout'),
  
  me: () => 
    http.get<AuthResponse>('/api/auth/profile') as unknown as Promise<AuthResponse>,
}