import { http } from '@/lib/http'

export interface Dataset {
  id: number
  name: string
  description: string
  file_type: string
  size: number
  status: 'ready' | 'processing' | 'error'
  created_at: string
  updated_at: string
  owner_id: number
}

export interface DatasetList {
  items: Dataset[]
  total: number
}

export interface DatasetCreate {
  name: string
  description?: string
  file: File
}

export const datasetsApi = {
  // 获取数据集列表
  getAll: (params?: { skip?: number; limit?: number }) =>
    http.get<DatasetList>('/api/v1/datasets', { params }),
  
  // 获取单个数据集
  getById: (id: number) =>
    http.get<Dataset>(`/api/v1/datasets/${id}`),
  
  // 上传新数据集
  upload: (data: FormData) =>
    http.post<Dataset>('/api/v1/datasets/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  // 更新数据集信息
  update: (id: number, data: Partial<Omit<Dataset, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>) =>
    http.put<Dataset>(`/api/v1/datasets/${id}`, data),
  
  // 删除数据集
  delete: (id: number) =>
    http.delete(`/api/v1/datasets/${id}`),
}