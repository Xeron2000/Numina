import axios from 'axios'
import { toast } from '@/hooks/use-toast'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred'
    toast({
      variant: 'destructive',
      title: 'Error',
      description: message,
    })
    return Promise.reject(error)
  }
)

export type { AxiosResponse, AxiosError } from 'axios'
