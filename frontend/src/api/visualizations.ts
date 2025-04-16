import apiClient from './client'

export interface Visualization {
  id: number
  name: string
  description: string
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'map'
  config: Record<string, any>
  dataset_id: number
  owner_id: number
  created_at: string
  updated_at: string
}

export interface VisualizationCreate {
  name: string
  description: string
  type: Visualization['type']
  config: Record<string, any>
  dataset_id: number
}

export interface VisualizationList {
  items: Visualization[]
  total: number
}

export const visualizationsApi = {
  getAll: (params?: { skip?: number; limit?: number; dataset_id?: number }) =>
    apiClient.get<VisualizationList>('/api/v1/visualizations', { params }),
  
  getById: (id: number) =>
    apiClient.get<Visualization>(`/api/v1/visualizations/${id}`),
  
  create: (data: VisualizationCreate) =>
    apiClient.post<Visualization>('/api/v1/visualizations', data),
  
  update: (id: number, data: Partial<VisualizationCreate>) =>
    apiClient.put<Visualization>(`/api/v1/visualizations/${id}`, data),
  
  delete: (id: number) =>
    apiClient.delete(`/api/v1/visualizations/${id}`),
}