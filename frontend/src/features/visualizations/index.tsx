import { Header } from '@/components/layout/header'
import { useEffect, useState } from 'react'
import { saveAs } from 'file-saver'
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
import { Brain } from 'lucide-react'
import { llmApi } from '@/api/llm'
import ReactMarkdown from 'react-markdown'
import { Document, Paragraph, Packer, HeadingLevel } from 'docx'
import { useTranslation } from 'react-i18next'
interface DatasetResponse {
  items: Dataset[]
  total: number
}

export default function Visualizations() {
  const location = useLocation()
  const { createSavedQuery } = analyticsApi
  const { toast } = useToast()
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [llmAnalysis, setLlmAnalysis] = useState<string>('')
  const [isLlmDialogOpen, setIsLlmDialogOpen] = useState(false)
  const [isLlmLoading, setIsLlmLoading] = useState(false)

  // 添加骨架屏组件
  const AnalyticsSkeleton = () => (
    <div className="space-y-6 mt-8 animate-pulse">
      {/* 摘要骨架 */}
      <div className="rounded-lg border p-6">
        <div className="h-6 w-48 bg-muted rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-muted rounded-lg">
              <div className="h-4 w-24 bg-muted-foreground/20 rounded mb-2"></div>
              <div className="h-8 w-32 bg-muted-foreground/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 图表骨架 */}
      <div className="space-y-6">
        <div className="h-6 w-32 bg-muted rounded"></div>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="h-[400px] bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 预测骨架 */}
      <div className="space-y-6">
        <div className="h-6 w-32 bg-muted rounded"></div>
        <div className="rounded-lg border p-4">
          <div className="h-[400px] bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )

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
          title: t('datasets.error.title'),
          description: t('datasets.error.load_failed')
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
            <h2 className="text-2xl font-bold tracking-tight">{t('viz.title')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('viz.subtitle')}
            </p>
          </div>
        </div>
      </Header>

      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex justify-end mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>{t('viz.add_dataset')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{t('viz.select_dataset')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('viz.search_dataset')}
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
                        {dataset.description || t('viz.no_desc')}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {t('viz.created_at', { time: format(new Date(dataset.created_at), 'yyyy-MM-dd HH:mm') })}
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
                {t('viz.none_pending')}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClear} disabled={!selectedDataset}>
                {t('viz.clear')}
              </Button>
              <Button onClick={handleAnalyze} disabled={!selectedDataset}>
                {t('viz.analyze')}
              </Button>

              <Dialog open={isLlmDialogOpen} onOpenChange={setIsLlmDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    disabled={!analyticsData}
                    onClick={async () => {
                      try {
                        setIsLlmLoading(true);
                        let prompt = "";
                        // 根据不同类型的数据生成不同的提示词
                        if (analyticsData.summary && 'charts' in analyticsData) {
                          if ('prediction' in analyticsData) {
                            // 历史数据分析结果
                            prompt = `分析这个城市的空气质量历史数据：
                        1. 平均AQI为${analyticsData.summary.平均空气质量指数}
                        2. 最高AQI为${analyticsData.summary.最高空气质量指数}
                        3. 最低AQI为${analyticsData.summary.最低空气质量指数}
                        请分析：
                        1. 空气质量的总体趋势如何？
                        2. 哪些时段空气质量较好/较差？
                        3. 针对这种情况，有什么建议？
                        4. 未来24小时的空气质量预测趋势如何？应该如何应对？`;
                          } else if ('城市总数' in analyticsData.summary) {
                            // 省份或全国数据分析结果
                            const cityCount = analyticsData.summary.城市总数;
                            const avgAQI = analyticsData.summary.平均空气质量指数;
                            const qualityDist = analyticsData.summary.空气质量分布;
                            prompt = `分析这${cityCount}个城市的空气质量数据：
                        1. 平均AQI为${avgAQI}
                        2. 空气质量分布：${JSON.stringify(qualityDist)}
                        请分析：
                        1. 整体空气质量状况如何？
                        2. 哪些城市的空气质量较好/较差？
                        3. 针对空气质量较差的地区，有什么改善建议？
                        4. 从各项污染物指标来看，主要存在什么问题？`;
                          }
                        }

                        setLlmAnalysis("");
                        setIsLlmDialogOpen(true);

                        const response = await llmApi.chat({
                          message: prompt,
                          dataset_id: selectedDataset?.id
                        });

                        if (!response.ok) {
                          throw new Error(`HTTP ${response.status}`);
                        }

                        const text = await response.text();
                        setLlmAnalysis(text);
                        setIsLlmLoading(false);
                      } catch (error) {
                        setIsLlmLoading(false);
                        toast({
                          variant: "destructive",
                          title: t('viz.toast.error.title'),
                          description: error instanceof Error ? error.message : t('viz.ai.call_error')
                        });
                      }
                    }}
                  >
                    <Brain className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] h-[600px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {t('viz.ai.title')}
                    </DialogTitle>
                    <Button
                      disabled={isLlmLoading}
                      onClick={async () => {
                        try {
                          // 创建文档
                          const doc = new Document({
                            sections: [{
                              properties: {},
                              children: [
                                new Paragraph({
                                  text: t('viz.ai.report_name'),
                                  heading: HeadingLevel.HEADING_1
                                }),
                                new Paragraph({
                                  text: "\n"
                                }),
                                ...llmAnalysis.split('\n').map(line => 
                                  new Paragraph({
                                    text: line.trim(),
                                    spacing: {
                                      after: 200
                                    }
                                  })
                                )
                              ]
                            }]
                          });

                          // 生成blob
                          const blob = await Packer.toBlob(doc);
                          
                          // 保存文件
                          saveAs(blob, "分析报告.docx");
                        } catch (error) {
                          console.error('生成文档失败:', error);
                          toast({
                            variant: "destructive",
                            title: t('viz.toast.error.title'),
                            description: t('viz.ai.doc_error')
                          });
                        }
                      }}
                    >
                      {t('viz.ai.export')}
                    </Button>
                  </DialogHeader>
                  <div className="space-y-4 py-4 overflow-y-auto flex-1">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="bg-card rounded-lg p-6">
                        {isLlmLoading ? (
                          <div className="space-y-4">
                            <div className="text-center text-muted-foreground">分析中，请稍候...</div>
                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
                              <div className="h-full w-2/3 animate-pulse bg-primary"></div>
                            </div>
                          </div>
                        ) : (
                          <ReactMarkdown
                            components={{
                              p: ({ node, ...props }) => <p className="text-base leading-7 mb-4" {...props} />
                            }}
                          >
                            {llmAnalysis}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        {/* 修改数据展示部分 */}
        {isAnalyzing ? (
          <AnalyticsSkeleton />
        ) : (
          analyticsData && (
            <div className="space-y-6 mt-8">
              {/* 原有的数据分析摘要部分 */}
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
        ))}
      </main>
    </>
  )
}