import { http } from '@/lib/http'

export interface DashboardStats {
  datasets_count: number
  analytics_count: number
  visualizations_count: number
  stations_count: number
  recent_activities: {
    id: number
    type: 'dataset' | 'analytics' | 'visualization'
    action: 'created' | 'updated' | 'deleted'
    title: string
    created_at: string
  }[]
  air_quality_trends: {
    date: string
    value: number
  }[]
  station_distribution: {
    province: string
    count: number
    coordinates: [number, number]
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
    http.get<Response<DashboardStats['air_quality_trends']>>('/api/dashboard/trends', { params }),

  // 获取站点分布
  getDistribution: () =>
    http.get<Response<DashboardStats['station_distribution']>>('/api/dashboard/distribution'),

  // 获取最近活动
  getActivities: (params?: { limit?: number }) =>
    http.get<Response<DashboardStats['recent_activities']>>('/api/dashboard/activities', { params })
}