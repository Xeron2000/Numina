import { http } from '@/lib/http'

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
  getSettings: () =>
    http.get<UserSettings>('/api/v1/settings/profile'),

  updateAppearance: (data: AppearanceSettings) =>
    http.put<UserSettings>('/api/v1/settings/appearance', data),

  updateDisplay: (data: DisplaySettings) =>
    http.put<UserSettings>('/api/v1/settings/display', data),
}