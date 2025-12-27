import { http } from '@/lib/http'
import { LLMConfig } from './settings'

const API_BASE_URL = 'http://localhost:8000'

export interface ChatRequest {
  message: string
  dataset_id?: number
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export const llmApi = {
  chat: (data: ChatRequest) => {
    return fetch(`${API_BASE_URL}/api/llm/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(data),
    })
  },

  getModels: async (config?: LLMConfig): Promise<string[]> => {
    if (config) {
      const response = await http.post<ApiResponse<string[]>>('/api/llm/models', {
        base_url: config.base_url,
        api_key: config.api_key
      })
      const data = response as unknown as ApiResponse<string[]>
      console.log('getModels response:', data)
      const models = data.data || []
      console.log('getModels models:', models)
      return models
    }
    const response = await http.get<ApiResponse<string[]>>('/api/llm/models')
    const data = response as unknown as ApiResponse<string[]>
    console.log('getModels response (GET):', data)
    const models = data.data || []
    console.log('getModels models (GET):', models)
    return models
  },
}
