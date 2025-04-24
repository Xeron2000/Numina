import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { datasetsApi, Dataset } from '@/api/datasets'  // Import Dataset type from API
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { DatasetList } from './components/dataset-list'
import { EmptyState } from './components/empty-state'
import { useToast } from '@/hooks/use-toast'

interface DatasetResponse {
  items: Dataset[]  // Use the Dataset type from API
  total: number
}

export default function Datasets() {
  const { toast } = useToast()
  const { data, isLoading, error } = useQuery({
    queryKey: ['datasets'],
    queryFn: async () => {
      try {
        const response = await datasetsApi.getAll()

        console.log('response', response)
        if (!response) {
          throw new Error('No data received from server')
        }
        return response as unknown as DatasetResponse  // 使用类型断言
      } catch (error) {
        toast({
          variant: 'destructive',
          title: '错误',
          description: '获取数据集失败'
        })
        throw error
      }
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
        </div>
      </Header>

      <Main>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <EmptyState />
        ) : !data?.items?.length ? (
          <EmptyState />
        ) : (
          <DatasetList datasets={data.items} />
        )}
      </Main>
    </>
  )
}