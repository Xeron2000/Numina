import { http } from '@/lib/http'

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

// Add or update the VisualizationCreate type
export interface VisualizationCreate {
  name: string;
  description: string; // Make it required
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'map';
  dataset_id: number;
  config: Record<string, any>;
}

export interface VisualizationList {
  items: Visualization[]
  total: number
}

export const visualizationsApi = {
  // 获取可视化列表
  getAll: (params?: { skip?: number; limit?: number; dataset_id?: number }) =>
    http.get<VisualizationList>('/api/v1/visualizations', { params }),
  
  // 获取单个可视化
  getById: (id: number) =>
    http.get<Visualization>(`/api/v1/visualizations/${id}`),
  
  // 创建新可视化
  create: (data: VisualizationCreate) =>
    http.post<Visualization>('/api/v1/visualizations', data),
  
  // 更新可视化
  update: (id: number, data: Partial<VisualizationCreate>) =>
    http.put<Visualization>(`/api/v1/visualizations/${id}`, data),
  
  // 删除可视化
  delete: (id: number) =>
    http.delete(`/api/v1/visualizations/${id}`),
}