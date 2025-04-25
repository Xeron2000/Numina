import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Play, Save, Settings2, Download } from 'lucide-react'
import { analyticsApi } from '@/api/analytics'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { QueryEditor } from './components/query-editor'
import { QueryResult } from './components/query-result'
import { DatasetSelector } from './components/dataset-selector'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function AnalyticsBuilder() {
  const [selectedDataset, setSelectedDataset] = useState<number | null>(null)
  const [queryString, setQueryString] = useState('')
  const [queryName, setQueryName] = useState('')
  const [queryDescription, setQueryDescription] = useState('')
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)

  const { data: result, isLoading: isRunning, refetch } = useQuery({
    queryKey: ['query-result', selectedDataset, queryString],
    queryFn: () => analyticsApi.runQuery({ 
      dataset_id: selectedDataset!, 
      query_string: queryString 
    }),
    enabled: false
  })

  // const saveQueryMutation = useMutation({
  //   mutationFn: (data: { name: string; description: string }) =>
  //     analyticsApi.createSavedQuery({
  //       name: data.name,
  //       description: data.description,
  //       query_string: queryString,
  //       dataset_id: selectedDataset!,
  //     }),
  //   onSuccess: () => {
  //     toast.success('查询已保存')
  //     setSaveDialogOpen(false)
  //   },
  //   onError: () => {
  //     toast.error('保存查询失败')
  //   },
  // })


  const handleRunQuery = () => {
    if (!selectedDataset) {
      toast.error('请选择数据集')
      return
    }
    if (!queryString.trim()) {
      toast.error('请输入查询语句')
      return
    }
    refetch()
  }

  return (
    <>
      <Header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex flex-1 items-center space-x-4">
            <h2 className="text-lg font-semibold">分析构建器</h2>
            <Separator orientation="vertical" className="h-6" />
            <div className="w-[240px]">
              <DatasetSelector value={selectedDataset} onChange={setSelectedDataset} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className='ml-2'>
                  <Settings2 className="mr-2 h-4 w-4" />
                  设置
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  导出结果
                </DropdownMenuItem>
                <DropdownMenuItem>格式化查询</DropdownMenuItem>
                <DropdownMenuItem>编辑器设置</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!queryString}>
                  <Save className="mr-2 h-4 w-4" />
                  保存查询
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>保存查询</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">查询名称</Label>
                    <Input
                      id="name"
                      value={queryName}
                      onChange={(e) => setQueryName(e.target.value)}
                      placeholder="输入查询名称"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">描述</Label>
                    <Textarea
                      id="description"
                      value={queryDescription}
                      onChange={(e) => setQueryDescription(e.target.value)}
                      placeholder="输入查询描述（可选）"
                    />
                  </div>
  
                </div>
              </DialogContent>
            </Dialog>

            <Button
              size="sm"
              disabled={!selectedDataset || !queryString || isRunning}
              onClick={handleRunQuery}
            >
              <Play className="mr-2 h-4 w-4" />
              运行查询
            </Button>
          </div>
        </div>
      </Header>

      <Main className="grid h-[calc(100vh-4rem)] grid-cols-2 gap-4 p-6">
        <div className="space-y-4">
          <QueryEditor
            value={queryString}
            onChange={setQueryString}
            disabled={!selectedDataset}
          />
        </div>
        <QueryResult data={result?.data} isLoading={isRunning} />
      </Main>
    </>
  )
}