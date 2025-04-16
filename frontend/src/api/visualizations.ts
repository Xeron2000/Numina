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
  // 获取可视化列表
  getAll: (params?: { skip?: number; limit?: number; dataset_id?: number }) =>
    apiClient.get<VisualizationList>('/api/visualizations', { params }),
  
  // 获取单个可视化
  getById: (id: number) =>
    apiClient.get<Visualization>(`/api/visualizations/${id}`),
  
  // 创建可视化
  create: (data: VisualizationCreate) =>
    apiClient.post<Visualization>('/api/visualizations', data),
  
  // 更新可视化
  update: (id: number, data: Partial<VisualizationCreate>) =>
    apiClient.patch<Visualization>(`/api/visualizations/${id}`, data),
  
  // 删除可视化
  delete: (id: number) =>
    apiClient.delete(`/api/visualizations/${id}`),
}