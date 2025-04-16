import apiClient from './client'

export interface Dataset {
  id: number
  name: string
  description: string
  file_type: string
  created_at: string
  updated_at: string
}

export const datasetsApi = {
  getAll: () => apiClient.get<Dataset[]>('/api/datasets'),
  
  getById: (id: number) => apiClient.get<Dataset>(`/api/datasets/${id}`),
  
  create: (data: FormData) => 
    apiClient.post<Dataset>('/api/datasets', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    
  update: (id: number, data: Partial<Dataset>) =>
    apiClient.patch<Dataset>(`/api/datasets/${id}`, data),
    
  delete: (id: number) => apiClient.delete(`/api/datasets/${id}`),
}