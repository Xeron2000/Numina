import { http } from '@/lib/http'

export interface AnalyticsTask {
  id: number
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  dataset_id: number
  query_string: string
  created_at: string
}

export interface QueryResult {
  columns: string[]
  rows: Record<string, any>[]
}

export interface SavedQueryCreate {
  name: string
  description: string
  query_string: string
  dataset_id: number
}

export interface SavedQuery extends SavedQueryCreate {
  id: number
  created_at: string
  owner_id: number
}

export interface AnalyticsTaskList {
  items: AnalyticsTask[]
  total: number
}

export const analyticsApi = {
  getTaskById: (id: number) => 
    http.get<AnalyticsTask>(`/api/v1/analytics/tasks/${id}`),
  
  runQuery: (params: { dataset_id: number; query_string: string }) =>
    http.post<QueryResult>('/api/v1/analytics/query', params),
    
  deleteTask: (id: number) =>
    http.delete<void>(`/api/v1/analytics/tasks/${id}`),

  // Add the new method
  createSavedQuery: (data: SavedQueryCreate) =>
    http.post<SavedQuery>('/api/v1/analytics/saved-queries', data),
  
  getTasks: (params?: { skip?: number; limit?: number }) =>
    http.get<AnalyticsTaskList>('/api/v1/analytics/tasks', { params }),
}