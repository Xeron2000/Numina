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
    http.get<AnalyticsTask>(`/api/analytics/tasks/${id}`),
  
  runQuery: (params: { dataset_id: number; query_string: string }) =>
    http.post<QueryResult>('/api/analytics/query', params),
    
  deleteTask: (id: number) =>
    http.delete<void>(`/api/analytics/tasks/${id}`),

  // Add the new task
  createSavedQuery: (query_in: number) => {
    const formData = new FormData();
    formData.append('query_in', String(query_in));
    return http.post('/api/analytics/saved-queries', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
},
  // all tasks
  getTasks: () =>
    http.get('/api/analytics/tasks'),
}