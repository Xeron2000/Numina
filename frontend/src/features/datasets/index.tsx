import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Plus, Upload, Loader2 } from 'lucide-react'
import { datasetsApi } from '@/api/datasets'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { DatasetList } from './components/dataset-list'
import { EmptyState } from './components/empty-state'

export default function Datasets() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['datasets'],
    queryFn: async () => {
      const response = await datasetsApi.getAll()
      return response.data
    }
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
            <Button onClick={() => navigate({ to: '/apps/datasets/upload' })}>
              <Plus className="mr-2 h-4 w-4" />
              新建数据集
            </Button>
          </div>
        </div>
      </Header>

      <Main>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !data?.items?.length ? (
          <EmptyState />
        ) : (
          <DatasetList datasets={data.items} />
        )}
      </Main>
    </>
  )
}