import { http } from '@/lib/http'

export interface DashboardStats {
  datasets_count: number
  analytics_count: number
  recent_activities: {
    title: string
    action: string
    created_at: string
  }[]
}

export interface Response<T> {
  code: number
  message: string
  data: T
}

export const dashboardApi = {
  // 获取仪表盘统计数据
  getStats: () => 
    http.get<Response<DashboardStats>>('/api/dashboard/stats'),

  // 获取空气质量趋势
  getTrends: (params: { days?: number }) =>
    http.get<Response<any>>('/api/dashboard/trends', { params }),

  // 获取站点分布
  getDistribution: () =>
    http.get<Response<any>>('/api/dashboard/distribution'),

  // 获取最近活动
  getActivities: (params?: { limit?: number }) =>
    http.get<Response<DashboardStats['recent_activities']>>('/api/dashboard/activities', { params })
}