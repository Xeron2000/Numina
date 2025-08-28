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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Pie, PieChart } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { cityDataService } from '@/services/city-data'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation()
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsResponse = await dashboardApi.getStats();
        setStats((statsResponse.data as unknown) as DashboardStats);

        // 检查 sessionStorage 中是否已有数据
        const storedCityData = sessionStorage.getItem('cityData');
        if (storedCityData) {
          // 如果有缓存数据，直接使用
          const categorizedData = processAirQualityData(JSON.parse(storedCityData));
          setCityAirQuality(categorizedData);
        } else {
          // 如果没有缓存数据，才去获取
          const cityDataResponse = await cityDataService.getCityData();
          const categorizedData = processAirQualityData(cityDataResponse.cityData);
          setCityAirQuality(categorizedData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: t('dashboard.stats.datasets.title'),
      value: stats?.datasets_count,
      description: t('dashboard.stats.datasets.desc'),
      icon: IconDatabase,
      link: '/apps/datasets'
    },
    {
      title: t('dashboard.stats.analytics.title'),
      value: stats?.analytics_count,
      description: t('dashboard.stats.analytics.desc'),
      icon: IconChartBar,
      link: '/apps/analytics/history'
    },
    {
      title: t('dashboard.stats.overall_aqi.title'),
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
      description: t('dashboard.stats.overall_aqi.desc'),
      icon: IconWind,
      link: '/apps/geospatial/map'
    }
  ]

  console.log('Current stats:', stats)

  return (
    <>
      <Header>
        <h2 className="text-lg font-semibold">{t('dashboard.title')}</h2>
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
                      <div className="text-2xl font-bold">
                        {stat.value === undefined || stat.value === null ? (
                          <span className="text-sm text-muted-foreground">数据加载中...</span>
                        ) : (
                          stat.value
                        )}
                      </div>
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
                <CardTitle>{t('dashboard.city_quality_distribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : cityAirQuality === null ? (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                    {t('dashboard.loading')}
                  </div>
                ) : cityAirQuality.length === 0 ? (
                  <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                    {t('dashboard.no_data')}
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-between">
                    <div className="h-[300px] w-[60%]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={cityAirQuality}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                          >
                            {cityAirQuality?.map((entry: { color: string | undefined }, index: any) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [t('dashboard.tooltip.count', { count: value }), '']}
                            labelStyle={{ color: '#666' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-[40%] space-y-2">
                      {cityAirQuality.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">
                            {t('dashboard.legend.item', { name: item.name, count: item.count })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.worst_cities_top10')}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={(() => {
                          const cityData = JSON.parse(sessionStorage.getItem('cityData') || '{}');
                          const worstCities: { name: string; aqi: number; quality: any }[] = [];

                          Object.entries(cityData).forEach(([province, cities]: [string, any]) => {
                            if (Array.isArray(cities)) {
                              cities.forEach((cityObj: any) => {
                                Object.entries(cityObj).forEach(([cityName, data]: [string, any]) => {
                                  if (data && typeof data.AQI === 'string') {
                                    const aqi = parseFloat(data.AQI);
                                    if (!isNaN(aqi)) {
                                      worstCities.push({
                                        name: `${province}-${cityName}`,
                                        aqi: aqi,
                                        quality: data.Quality
                                      });
                                    }
                                  }
                                });
                              });
                            }
                          });

                          return worstCities
                            .sort((a, b) => b.aqi - a.aqi)
                            .slice(0, 10);
                        })()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                      >
                        <XAxis
                          dataKey="name"
                          angle={45}
                          textAnchor="start"
                          height={60}
                          interval={0}
                          fontSize={12}
                        />
                        <YAxis
                          dataKey="aqi"
                          type="number"
                          domain={['auto', 'auto']}
                        />
                        <Tooltip
                          formatter={(value: any, name: string) => {
                            if (name === 'aqi') return [t('dashboard.tooltip.aqi', { value }), t('dashboard.tooltip.aqi_label')]
                            return [value, name]
                          }}
                        />
                        <Bar dataKey="aqi" fill="#ff7e00" name="aqi">
                          {
                            (() => {
                              const cityData = JSON.parse(sessionStorage.getItem('cityData') || '{}');
                              const worstCities: { name: string; aqi: number; quality: any }[] = [];

                              Object.entries(cityData).forEach(([province, cities]: [string, any]) => {
                                if (Array.isArray(cities)) {
                                  cities.forEach((cityObj: any) => {
                                    Object.entries(cityObj).forEach(([cityName, data]: [string, any]) => {
                                      if (data && typeof data.AQI === 'string') {
                                        const aqi = parseFloat(data.AQI);
                                        if (!isNaN(aqi)) {
                                          worstCities.push({
                                            name: `${province}-${cityName}`,
                                            aqi: aqi,
                                            quality: data.Quality
                                          });
                                        }
                                      }
                                    });
                                  });
                                }
                              });

                              return worstCities
                                .sort((a, b) => b.aqi - a.aqi)
                                .slice(0, 10)
                                .map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      entry.aqi > 300 ? '#7e0023' :
                                      entry.aqi > 200 ? '#99004c' :
                                      entry.aqi > 150 ? '#ff0000' :
                                      entry.aqi > 100 ? '#ff7e00' :
                                      entry.aqi > 50 ? '#ffff00' : '#00e400'
                                    }
                                  />
                                ));
                            })()
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
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
