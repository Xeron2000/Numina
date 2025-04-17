import { http } from '@/lib/http'

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
  getTasks: () => 
    http.get<AnalyticsTask[]>('/api/v1/analytics/tasks'),
  
  createTask: (data: { name: string; dataset_id: number }) =>
    http.post<AnalyticsTask>('/api/v1/analytics/tasks', data),
    
  getTaskById: (id: number) =>
    http.get<AnalyticsTask>(`/api/v1/analytics/tasks/${id}`),
  
  runQuery: (data: QueryRequest) => 
    http.post<QueryResult>('/api/v1/analytics/query', data),
  
  getSavedQueries: (params?: { skip?: number; limit?: number; dataset_id?: number }) =>
    http.get<SavedQueryList>('/api/v1/analytics/saved-queries', { params }),
  
  createSavedQuery: (data: SavedQueryCreate) =>
    http.post<SavedQuery>('/api/v1/analytics/saved-queries', data),
}