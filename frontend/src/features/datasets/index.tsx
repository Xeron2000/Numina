import { useState } from 'react'
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
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const { data, isLoading, error } = useQuery({
    queryKey: ['datasets'],
    queryFn: async () => {
      try {
        const data = await datasetsApi.getAll()
        const response = data as unknown as DatasetResponse
        if (!response) {
          throw new Error('No data received from server')
        }
        
        // 对数据进行倒序排序
        const sortedItems = [...response.items].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        
        return {
          items: sortedItems,
          total: response.total
        } as DatasetResponse
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

  // 计算分页数据
  const paginatedData = data?.items?.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.ceil((data?.items?.length || 0) / pageSize)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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
          <DatasetList 
            datasets={paginatedData || []} 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Main>
    </>
  )
}