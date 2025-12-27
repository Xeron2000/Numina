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
  login: async (credentials: LoginCredentials) => {
    const response = await http.post<AuthResponse>('/api/auth/login', credentials) as unknown as AuthResponse
    localStorage.setItem('access_token', response.access_token)
    return response
  },

  register: (data: RegisterCredentials) =>
    http.post<AuthResponse>('/api/auth/register', data) as unknown as Promise<AuthResponse>,

  logout: () => {
    localStorage.removeItem('access_token')
    return http.post('/api/auth/logout')
  },

  me: () =>
    http.get<AuthResponse>('/api/auth/profile') as unknown as Promise<AuthResponse>,
}
