import apiClient from './client'

export interface AnalyticsTask {
  id: number
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  dataset_id: number
  created_at: string
}

export interface QueryRequest {
  dataset_id: number
  query_string: string
}

export interface QueryResult {
  columns: string[]
  data: any[]
  row_count: number
}

export interface SavedQuery {
  id: number
  name: string
  description: string
  query_string: string
  dataset_id: number
  owner_id: number
  created_at: string
  updated_at: string
}

export interface SavedQueryCreate {
  name: string
  description: string
  query_string: string
  dataset_id: number
}

export interface SavedQueryList {
  items: SavedQuery[]
  total: number
}

export const analyticsApi = {
  getTasks: () => apiClient.get<AnalyticsTask[]>('/api/analytics/tasks'),
  
  createTask: (data: { name: string; dataset_id: number }) =>
    apiClient.post<AnalyticsTask>('/api/analytics/tasks', data),
    
  getTaskById: (id: number) =>
    apiClient.get<AnalyticsTask>(`/api/analytics/tasks/${id}`),
  
  // 执行查询
  runQuery: (data: QueryRequest) => 
    apiClient.post<QueryResult>('/api/analytics/query', data),
  
  // 获取保存的查询列表
  getSavedQueries: (params?: { skip?: number; limit?: number; dataset_id?: number }) =>
    apiClient.get<SavedQueryList>('/api/analytics/saved-queries', { params }),
  
  // 创建保存的查询
  createSavedQuery: (data: SavedQueryCreate) =>
    apiClient.post<SavedQuery>('/api/analytics/saved-queries', data),
}