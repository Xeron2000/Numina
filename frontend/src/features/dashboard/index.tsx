import { Link } from '@tanstack/react-router'
import {
  IconDatabase,
  IconChartBar,
  IconWind,
} from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useEffect, useState } from 'react'
import { DashboardStats, dashboardApi } from '@/api/dashboard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [cityAirQuality, setCityAirQuality] = useState<any>(null)

  // 修改空气质量分类函数
  const categorizeAirQuality = (aqi: number) => {
    if (aqi <= 50) return '优'
    if (aqi <= 100) return '良'
    if (aqi <= 150) return '轻度污染'
    if (aqi <= 200) return '中度污染'
    if (aqi <= 300) return '重度污染'
    return '严重污染'
  }

  // 处理数据分类统计
  const processAirQualityData = (data: any) => {
    // 初始化所有分类
    const categories = {
      '优': { count: 0, color: '#00e400' },
      '良': { count: 0, color: '#ffff00' },
      '轻度污染': { count: 0, color: '#ff7e00' },
      '中度污染': { count: 0, color: '#ff0000' },
      '重度污染': { count: 0, color: '#99004c' },
      '严重污染': { count: 0, color: '#7e0023' }
    }
    
    // 处理数据对象
    if (typeof data === 'object' && data !== null) {
      Object.values(data).forEach(provinceData => {
        if (Array.isArray(provinceData)) {
          provinceData.forEach(cityObj => {
            Object.values(cityObj).forEach(city => {
              if (city && typeof (city as any).AQI === 'string') {
                const aqi = parseFloat((city as { AQI: string }).AQI);
                if (!isNaN(aqi)) {
                  const category = categorizeAirQuality(aqi);
                  if (categories[category]) {
                    categories[category].count++;
                  }
                }
              }
            });
          });
        }
      });
    }

    return Object.entries(categories).map(([name, { count, color }]) => ({
      name,
      count,
      color
    }));
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getStats()
        setStats((response.data as unknown) as DashboardStats)
        
        // 从 sessionStorage 获取城市空气质量数据
        const cityData = JSON.parse(sessionStorage.getItem('cityData') || '{}')
        const categorizedData = processAirQualityData(cityData)
        setCityAirQuality(categorizedData)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: '数据集总数',
      value: stats?.datasets_count,
      description: '包含各地区空气质量监测数据',
      icon: IconDatabase,
      link: '/apps/datasets'
    },
    {
      title: '分析任务',
      value: stats?.analytics_count,
      description: '已完成的数据分析任务',
      icon: IconChartBar,
      link: '/apps/analytics/history'
    },
    {
      title: '整体空气质量',
      value: cityAirQuality ? 
        (() => {
          const cityData = JSON.parse(sessionStorage.getItem('cityData') || '{}');
          let totalAQI = 0;
          let cityCount = 0;
          
          Object.values(cityData).forEach((provinceData: any) => {
            if (Array.isArray(provinceData)) {
              provinceData.forEach(cityObj => {
                Object.values(cityObj).forEach(city => {
                  if (city && typeof (city as any).AQI === 'string') {
                    const aqi = parseFloat((city as { AQI: string }).AQI);
                    if (!isNaN(aqi)) {
                      totalAQI += aqi;
                      cityCount++;
                    }
                  }
                });
              });
            }
          });
          
          return cityCount > 0 ? Math.round(totalAQI / cityCount) : '-';
        })() : '-',
      description: '全国城市平均AQI指数',
      icon: IconWind,
      link: '/apps/geospatial/map'
    }
  ]
  
  console.log('Current stats:', stats)
  
  return (
    <>
      <Header>
        <h2 className="text-lg font-semibold">仪表盘</h2>
        <div className="ml-auto flex items-center gap-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {statCards.map((stat) => (
              <Card key={stat.title} className="relative">
                <Link
                  to={stat.link}
                  className="absolute inset-0 z-10 rounded-lg ring-offset-background transition-colors hover:bg-muted/50"
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>城市空气质量分布</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cityAirQuality}>
                        <XAxis 
                          dataKey="name"
                          interval={0}
                          angle={30}
                          textAnchor="start"
                          height={60}
                          fontSize={12}
                          tickMargin={20}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`${value} 个城市`, '数量']}
                          labelStyle={{ color: '#666' }}
                        />
                        <Bar 
                          dataKey="count" 
                          name="城市数量"
                          maxBarSize={50}
                        >
                          {
                            cityAirQuality?.map((entry: { color: string | undefined }, index: any) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>最新活动</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {stats?.recent_activities.map((activity, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(activity.created_at), 'yyyy-MM-dd HH:mm')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs capitalize px-2 py-1 rounded-full ${
                              activity.action === 'create' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : activity.action === 'delete'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {activity.action === 'create' ? '新增' 
                                : activity.action === 'delete' ? '删除' 
                                : '分析'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}
