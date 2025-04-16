import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Play, Save } from 'lucide-react'
import { analyticsApi } from '@/api/analytics'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { QueryEditor } from './components/query-editor'
import { QueryResult } from './components/query-result'
import { DatasetSelector } from './components/dataset-selector'

export default function AnalyticsBuilder() {
  const [selectedDataset, setSelectedDataset] = useState<number | null>(null)
  const [queryString, setQueryString] = useState('')

  const { data: result, isLoading: isRunning, refetch } = useQuery({
    queryKey: ['query-result', selectedDataset, queryString],
    queryFn: () => analyticsApi.runQuery({ 
      dataset_id: selectedDataset!, 
      query_string: queryString 
    }),
    enabled: false
  })

  return (
    <>
      <Header>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">分析构建器</h2>
            <p className="text-sm text-muted-foreground">
              构建和执行数据分析查询
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={!queryString}>
              <Save className="mr-2 h-4 w-4" />
              保存查询
            </Button>
            <Button 
              disabled={!selectedDataset || !queryString} 
              onClick={() => refetch()}
            >
              <Play className="mr-2 h-4 w-4" />
              运行查询
            </Button>
          </div>
        </div>
      </Header>

      <Main>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Card className="p-4">
              <DatasetSelector 
                value={selectedDataset} 
                onChange={setSelectedDataset} 
              />
            </Card>
            <Card className="p-4">
              <QueryEditor 
                value={queryString} 
                onChange={setQueryString}
                disabled={!selectedDataset}
              />
            </Card>
          </div>
          <Card className="p-4">
            <QueryResult data={result} isLoading={isRunning} />
          </Card>
        </div>
      </Main>
    </>
  )
}