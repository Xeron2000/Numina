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
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

// 临时数据，后续替换为API调用
const stats = [
  {
    title: '数据集总数',
    value: '12',
    description: '包含各地区空气质量监测数据',
    icon: IconDatabase,
    link: '/apps/datasets'
  },
  {
    title: '分析任务',
    value: '25',
    description: '已完成的数据分析任务',
    icon: IconChartBar,
    link: '/apps/analytics/history'
  },
  {
    title: '可视化报表',
    value: '8',
    description: '已创建的数据可视化',
    icon: IconChartPie,
    link: '/apps/visualizations'
  },
  {
    title: '地理覆盖',
    value: '15',
    description: '监测站点数量',
    icon: IconMap,
    link: '/apps/geospatial/map'
  }
]

export default function Dashboard() {
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
          <div>
            <h1 className="text-2xl font-bold">空气污染数据分析平台</h1>
            <p className="text-muted-foreground">
              实时监测和分析空气质量数据，为环境决策提供支持
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
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
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  <IconArrowUpRight
                    className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
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
                {/* 这里集成趋势图表 */}
                <div className="h-[300px]" />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>地理分布</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 这里集成地图组件 */}
                <div className="h-[300px]" />
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}
