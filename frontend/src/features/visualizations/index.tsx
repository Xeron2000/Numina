// import { useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { useState } from 'react'
import { datasetsApi, Dataset } from '@/api/datasets' 
import { useToast } from '@/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search } from 'lucide-react'
import { format } from 'date-fns'

interface DatasetResponse {
  items: Dataset[]
  total: number
}

export default function Visualizations() {
  // const navigate = useNavigate()
  const { toast } = useToast()
  const [searchText, setSearchText] = useState('')
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // , isLoading
  const { data } = useQuery({
    queryKey: ['datasets'],
    queryFn: async () => {
      try {
        const data = await datasetsApi.getAll()
        const response = data as unknown as DatasetResponse
        if (!response) {
          throw new Error('No data received from server')
        }
        
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

  const filteredDatasets = data?.items.filter(dataset => 
    dataset.name.toLowerCase().includes(searchText.toLowerCase())
  ) || []

  const handleDatasetSelect = (dataset: Dataset) => {
    setSelectedDataset(dataset)
    setIsDialogOpen(false)
  }

  const handleClear = () => {
    setSelectedDataset(null)
  }

  const handleAnalyze = () => {
    if (selectedDataset) {
      console.log('分析数据集:', selectedDataset.id)
      // TODO: 实现分析逻辑
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  return (
    <>
      <Header>
        <div className="flex items-center justify-between py-8 mt-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">数据分析与可视化</h2>
            <p className="text-sm text-muted-foreground">
              分析数据，生成可视化图
            </p>
          </div>
        </div>
      </Header>

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex justify-end mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>添加数据集</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>选择数据集</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索数据集..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="h-[400px] overflow-y-auto">
                  {filteredDatasets.map((dataset) => (
                    <div
                      key={dataset.id}
                      className="p-4 rounded-lg border cursor-pointer hover:bg-muted"
                      onClick={() => handleDatasetSelect(dataset)}
                    >
                      <div className="font-medium">{dataset.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {dataset.description || '暂无描述'}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        创建于 {format(new Date(dataset.created_at), 'yyyy-MM-dd HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg border p-4">
          <div className="space-y-4">
            {selectedDataset ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">名称</th>
                      <th className="text-left p-2">描述</th>
                      <th className="text-left p-2">文件类型</th>
                      <th className="text-left p-2">文件大小</th>
                      <th className="text-left p-2">行数</th>
                      <th className="text-left p-2">状态</th>
                      <th className="text-left p-2">创建时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2">{selectedDataset.name}</td>
                      <td className="p-2">{selectedDataset.description || '暂无描述'}</td>
                      <td className="p-2">{selectedDataset.file_type}</td>
                      <td className="p-2">{formatFileSize(selectedDataset.file_size)}</td>
                      <td className="p-2">{selectedDataset.row_count}</td>
                      <td className="p-2">{selectedDataset.status}</td>
                      <td className="p-2">{format(new Date(selectedDataset.created_at), 'yyyy-MM-dd HH:mm')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                暂无待分析数据集
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClear} disabled={!selectedDataset}>
                清空
              </Button>
              <Button onClick={handleAnalyze} disabled={!selectedDataset}>
                分析
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}