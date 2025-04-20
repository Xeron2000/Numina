import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Plus, Grid, List, SortAsc, Filter } from 'lucide-react'
import { useState } from 'react'
import { visualizationsApi } from '@/api/visualizations'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { VisualizationCard } from './components/visualization-card'
import { EmptyState } from './components/empty-state'
import type { Visualization } from '@/api/visualizations'

type ViewMode = 'grid' | 'list'
type SortField = 'name' | 'created_at' | 'type'

export default function Visualizations() {
  const navigate = useNavigate()
  const [search] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [typeFilter, setTypeFilter] = useState<Visualization['type'] | 'all'>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['visualizations'],
    queryFn: () => visualizationsApi.getAll()
  })

  const filteredData = data?.data.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    return matchesSearch && matchesType
  }).sort((a, b) => {
    if (sortField === 'created_at') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return a[sortField].localeCompare(b[sortField])
  })

  return (
    <>
      <Header>
        <div className="flex items-center justify-between py-8 mt-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">数据可视化</h2>
            <p className="text-sm text-muted-foreground">
              创建和管理您的数据可视化图表，深入分析数据洞察
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/apps/visualizations/create' })} size="lg" className="px-2 mt-4 ml-8 mr-4">
            <Plus />
            创建可视化
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                筛选
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>可视化类型</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                全部类型
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTypeFilter('line')}>折线图</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('bar')}>柱状图</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('pie')}>饼图</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('scatter')}>散点图</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter('map')}>地图</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SortAsc className="mr-2 h-4 w-4" />
                排序
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortField('created_at')}>
                创建时间
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortField('name')}>
                名称
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortField('type')}>
                类型
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Header>

      <Main>
        {isLoading ? (
          <div className={viewMode === 'grid' ? 
            "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : 
            "space-y-4"
          }>
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-[200px]" />
                <Skeleton className="mt-4 h-4 w-[200px]" />
                <Skeleton className="mt-2 h-4 w-[160px]" />
              </Card>
            ))}
          </div>
        ) : !filteredData?.length ? (
          <EmptyState
            title="暂无可视化"
            description="开始创建您的第一个数据可视化图表"
            action={
              <Button onClick={() => navigate({ to: '/apps/visualizations/create' })}>
                <Plus className="mr-2 h-4 w-4" />
                创建可视化
              </Button>
            }
          />
        ) : (
          <div className={viewMode === 'grid' ? 
            "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : 
            "space-y-4"
          }>
            {filteredData?.map((item) => (
              <Card key={item.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
                <div className="absolute right-2 top-2 z-10">
                  <Badge variant={
                    item.type === 'line' ? 'default' :
                    item.type === 'bar' ? 'secondary' :
                    item.type === 'pie' ? 'destructive' :
                    item.type === 'scatter' ? 'outline' : 'default'
                  }>
                    {item.type}
                  </Badge>
                </div>
                <VisualizationCard 
                  visualization={item} 
                  viewMode={viewMode}
                />
              </Card>
            ))}
          </div>
        )}
      </Main>
    </>
  )
}