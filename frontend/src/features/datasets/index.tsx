import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Plus, Upload } from 'lucide-react'
import { datasetsApi } from '@/api/datasets'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Skeleton } from '@/components/ui/skeleton'
import { DatasetCard } from './components/dataset-card'

export default function Datasets() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => datasetsApi.getAll()
  })

  return (
    <>
      <Header>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">数据集</h2>
            <p className="text-sm text-muted-foreground">
              管理和分析您的数据集
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate({ to: '/apps/datasets/upload' })}>
              <Upload className="mr-2 h-4 w-4" />
              上传数据集
            </Button>
            <Button onClick={() => navigate({ to: '/apps/datasets' })}>
              <Plus className="mr-2 h-4 w-4" />
              新建数据集
            </Button>
          </div>
        </div>
      </Header>

      <Main>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-[160px]" />
                <Skeleton className="mt-4 h-4 w-[200px]" />
                <Skeleton className="mt-2 h-4 w-[160px]" />
              </Card>
            ))
          ) : (
            data?.data.map((item) => (
              <DatasetCard key={item.id} dataset={item} />
            ))
          )}
        </div>
      </Main>
    </>
  )
}