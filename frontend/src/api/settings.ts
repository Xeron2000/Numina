import apiClient from './client'

export interface UserSettings {
  id: number
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications_enabled: boolean
  display_settings?: Record<string, any>
  map_settings?: Record<string, any>
  user_id: number
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
}

export interface DisplaySettings {
  [key: string]: any
}

export const settingsApi = {
  // 获取用户设置
  getSettings: () =>
    apiClient.get<UserSettings>('/api/v1/settings/profile'),

  // 更新主题设置
  updateAppearance: (data: AppearanceSettings) =>
    apiClient.put<UserSettings>('/api/v1/settings/appearance', data),

  // 更新显示设置
  updateDisplay: (data: DisplaySettings) =>
    apiClient.put<UserSettings>('/api/v1/settings/display', data),
}