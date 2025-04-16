import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { visualizationsApi } from '@/api/visualizations'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Skeleton } from '@/components/ui/skeleton'
import { VisualizationCard } from './components/visualization-card'

export default function Visualizations() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['visualizations'],
    queryFn: () => visualizationsApi.getAll()
  })

  return (
    <>
      <Header>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">数据可视化</h2>
            <p className="text-sm text-muted-foreground">
              创建和管理您的数据可视化图表
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/apps/visualizations/create' })}>
            <Plus className="mr-2 h-4 w-4" />
            创建可视化
          </Button>
        </div>
      </Header>

      <Main>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-[200px]" />
                  <Skeleton className="mt-4 h-4 w-[200px]" />
                  <Skeleton className="mt-2 h-4 w-[160px]" />
                </Card>
              ))
          ) : (
            data?.data.items.map((item) => (
              <VisualizationCard key={item.id} visualization={item} />
            ))
          )}
        </div>
      </Main>
    </>
  )
}