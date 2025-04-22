import { Link } from '@tanstack/react-router'
import {
  IconDatabase,
  IconChartBar,
  IconMap,
  IconChartPie,
  IconArrowUpRight,
} from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useEffect, useState } from 'react'
import { DashboardStats, dashboardApi } from '@/api/dashboard'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getStats()
        setStats(response.data.data)
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
      title: '可视化报表',
      value: stats?.visualizations_count,
      description: '已创建的数据可视化',
      icon: IconChartPie,
      link: '/apps/visualizations'
    },
    {
      title: '地理覆盖',
      value: stats?.stations_count,
      description: '监测站点数量',
      icon: IconMap,
      link: '/apps/geospatial/map'
    }
  ]

  return (
    <>
      <Header>
        <h2 className="text-lg font-semibold">仪表盘</h2>
        {/* <Search /> */}
        <div className="ml-auto flex items-center gap-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                      <IconArrowUpRight
                        className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>空气质量趋势</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats?.air_quality_trends || []}>
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => format(new Date(value), 'MM-dd')}
                        />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#2563eb"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>地理分布</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px] rounded-md overflow-hidden">
                    <MapContainer
                      center={[35.86166, 104.195397]}
                      zoom={4}
                      className="h-full w-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {stats?.station_distribution.map((station) => (
                        <CircleMarker
                          key={station.province}
                          center={[station.coordinates[0], station.coordinates[1]]}
                          radius={Math.sqrt(station.count) * 3}
                          fillColor="#2563eb"
                          color="#2563eb"
                          weight={1}
                          opacity={0.8}
                          fillOpacity={0.4}
                        >
                          <Popup>
                            <div className="text-sm">
                              <p className="font-medium">{station.province}</p>
                              <p>站点数量: {station.count}</p>
                            </div>
                          </Popup>
                        </CircleMarker>
                      ))}
                    </MapContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}
