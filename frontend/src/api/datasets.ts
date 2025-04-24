import { http } from '@/lib/http'

export interface Dataset {
  id: number
  name: string
  description: string | null
  file_type: string
  file_size: number
  row_count: number
  created_at: string
  status: 'ready' | 'processing' | 'error'
  data: Record<string, any> | any[]
}

export interface Response<T> {
  code: number
  message: string
  data: T
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
  getAll: () => http.get<DatasetList>('/api/datasets'),

  // 获取单个数据集
  getById: (id: number) =>
    http.get<Dataset>(`/api/datasets/${id}`),

  // 上传新数据集
  upload: async (datasets: any[], province: string) => {
    const formData = new FormData()
    formData.append('name', province)
    formData.append('data_json', JSON.stringify(datasets))
    
    return http.post('/api/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  uploaddict: async (datasets: Record<string, any>) => {
    const formData = new FormData()
    formData.append('name', 'china')
    formData.append('data_json', JSON.stringify(datasets))

    return http.post('/api/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}