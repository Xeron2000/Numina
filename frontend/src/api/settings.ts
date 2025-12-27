import { http } from '@/lib/http'

export interface UserSettings {
  id: number
  theme: 'light' | 'dark' | 'system'
  language: string
  map_settings?: Record<string, any>
  user_id: number
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  font: string
}

export interface DisplaySettings {
  [key: string]: any
}

export interface UserProfile {
  id: number
  username: string
  email: string
}

export interface ProfileUpdateDto {
  username: string
  email: string
}

// 基础响应接口
interface BaseResponse<T> {
  code: number
  message: string
  data: T
}

// 账户设置接口
export interface AccountSettings {
  name: string
  language: string
  dob: string
}

// LLM配置接口
export interface LLMConfig {
  base_url: string
  api_key: string
  model: string
  provider: string
}

export const settingsApi = {
  getSettings: () =>
    http.get<UserSettings>('/api/settings/profile'),

  // 获取外观设置
  getAppearance: () =>
    http.get<BaseResponse<AppearanceSettings>>('/api/settings/appearance'),

  // 更新外观设置
  updateAppearance: (data: AppearanceSettings) =>
    http.put<BaseResponse<AppearanceSettings>>('/api/settings/appearance', data),

  getProfile: () =>
    http.get<{
      code: number
      message: string
      data: UserProfile
    }>('/api/settings/profile'),

  updateProfile: (data: ProfileUpdateDto) =>
    http.put<{
      code: number
      message: string
      data: UserProfile
    }>('/api/settings/profile', data),

      // 获取账户设置
  getAccountSettings: () =>
    http.get<BaseResponse<AccountSettings>>('/api/settings/account'),

  // 更新账户设置
  updateAccountSettings: (data: AccountSettings) =>
    http.put<BaseResponse<AccountSettings>>('/api/settings/account', data),

  // 获取LLM配置
  getLLMConfig: () =>
    http.get<BaseResponse<LLMConfig>>('/api/settings/llm'),

  // 更新LLM配置
  updateLLMConfig: (data: LLMConfig) =>
    http.put<BaseResponse<LLMConfig>>('/api/settings/llm', data),
}
