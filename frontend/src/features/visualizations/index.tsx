import { Header } from '@/components/layout/header'
import { useEffect, useState } from 'react'
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
import ReactECharts from 'echarts-for-react'
import { useLocation } from '@tanstack/react-router'
import { analyticsApi } from '@/api/analytics'

interface DatasetResponse {
  items: Dataset[]
  total: number
}

export default function Visualizations() {
  const location = useLocation()
  const { createSavedQuery } = analyticsApi
  const { toast } = useToast()
  const [searchText, setSearchText] = useState('')
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    // 从 URL 搜索参数中获取数据
    const searchParams = new URLSearchParams(location.search)
    const analyticsDataStr = searchParams.get('analyticsData')
    if (analyticsDataStr) {
      try {
        const data = JSON.parse(analyticsDataStr)
        setAnalyticsData(data)
      } catch (error) {
        console.error('Failed to parse analytics data:', error)
      }
    }
    
    // 检查是否有通过路由传递的数据
    if (location.state && 'analyticsData' in location.state) {
      setAnalyticsData(location.state.analyticsData)
    }
  }, [location.search, location.state])
  
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
    if (selectedDataset && isAnalyzing) {
      toast({
        variant: "destructive",
        title: '警告',
        description: '正在分析中，请后清空'
      })
    } else if (selectedDataset && !isAnalyzing) {
      setSelectedDataset(null)
    }
  }

  const handleAnalyze = async () => {
    if (selectedDataset && !isAnalyzing) {
      try {
        setIsAnalyzing(true)
        console.log('分析数据集:', selectedDataset.id)
        const data = await createSavedQuery(Number(selectedDataset.id))
        setAnalyticsData(data)
        toast({
          variant: "default",
          title: '成功',
          description: '数据集分析成功'
        })
      } catch (error) {
        console.error('Analysis failed:', error)
        toast({
          variant: "destructive",
          title: '错误',
          description: '数据分析失败，请重试'
        })
      } finally {
        setIsAnalyzing(false)
      }
    } else if (isAnalyzing && selectedDataset) {
      toast({
        variant: "destructive",
        title: '警告',
        description: '正在分析中，请稍后再试'
      })
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
                      <td className="p-2">
                        {(() => {
                          const date = new Date(selectedDataset.created_at)
                          date.setHours(date.getHours() + 8)
                          return format(date, 'yyyy-MM-dd HH:mm')
                        })()}
                      </td>
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
        {analyticsData && (
          <div className="space-y-6 mt-8">
            {/* 数据分析摘要 */}
            {analyticsData.summary && (
              <div className="rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-4">数据分析摘要</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(analyticsData.summary).map(([key, value]: [string, any]) => (
                    <div key={key} className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">{key}</div>
                      <div className="text-2xl font-bold">
                        {typeof value === 'object' 
                          ? Object.entries(value).map(([k, v]) => (
                              <div key={k} className="text-sm">
                                {String(k)}: {String(v)}
                              </div>
                            ))
                          : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 图表展示 */}
            {analyticsData.charts && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">数据可视化</h3>
                <div className="grid grid-cols-1 gap-6">
                  {Object.entries(analyticsData.charts).map(([key, chartData]: [string, any]) => (
                    <div key={key} className="rounded-lg border p-4">
                      <div className="h-[400px]">
                        <ReactECharts
                          option={{
                            ...chartData,
                            tooltip: {
                              ...chartData.tooltip,
                              formatter: key === 'quality_pie' 
                                ? '{b}: {c} ({d}%)'
                                : undefined
                            },
                            grid: {
                              containLabel: true,
                              left: '3%',
                              right: '4%',
                              bottom: '3%'
                            },
                            legend: key === 'pollutants_trend' ? {
                              data: ["PM2.5", "PM10", "SO2", "NO2", "O3", "CO"]
                            } : chartData.legend,
                            series: key === 'pollutants_trend' ? chartData.series.map((series: any) => ({
                              ...series,
                              name: series.name === 'PM2_5' ? 'PM2.5' : series.name
                            })) : chartData.series,
                            radar: key === 'pollutant_radar' ? {
                              ...chartData.radar,
                              splitNumber: 5,
                              axisLabel: {
                                show: false  // 修改这里，将 show 设置为 false
                              },
                              splitArea: {
                                show: true
                              },
                              axisLine: {
                                show: true
                              }
                            } : undefined,
                            toolbox: {
                              feature: {
                                saveAsImage: {}
                              }
                            }
                          }}
                          style={{ height: '100%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 预测数据展示 */}
            {analyticsData.prediction && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">预测分析</h3>
                <div className="rounded-lg border p-4">
                  <div className="h-[400px]">
                    <ReactECharts
                      option={{
                        ...analyticsData.prediction,
                        grid: {
                          containLabel: true,
                          left: '3%',
                          right: '4%',
                          bottom: '3%'
                        },
                        toolbox: {
                          feature: {
                            saveAsImage: {}
                          }
                        }
                      }}
                      style={{ height: '100%' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  )
}