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
  getAll: () => 
    apiClient.get<Dataset[]>('/api/v1/datasets'),
  
  getById: (id: number) => 
    apiClient.get<Dataset>(`/api/v1/datasets/${id}`),
  
  create: (data: FormData) => 
    apiClient.post<Dataset>('/api/v1/datasets', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    
  update: (id: number, data: Partial<Dataset>) =>
    apiClient.put<Dataset>(`/api/v1/datasets/${id}`, data),
    
  delete: (id: number) => 
    apiClient.delete(`/api/v1/datasets/${id}`),
}