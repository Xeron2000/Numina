import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, FileSpreadsheet, Calendar, Database, FileType } from 'lucide-react'
import { datasetsApi, Dataset } from '@/api/datasets'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CityData {
  [cityName: string]: {
    AQI: string;
    Quality: string;
    TimePoint: string;
    PrimaryPollutant: string;
    PM2_5: string;
    PM10: string;
    SO2: string;
    NO2: string;
    O3: string;
    CO: string;
    Measure?: string;
  }
}

interface DatasetData {
  [province: string]: CityData[];
}

export default function DatasetDetail() {
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('hour')
  const [page, setPage] = useState(1)
  const itemsPerPage = 5

  // 修改时间范围选择的处理函数
  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value)
    setPage(1)  // 重置页码
  }

  let { id } = useParams({ from: '/_authenticated/apps/datasets/$id' })
  if (!Number.isFinite(Number(id))) {
    id = sessionStorage.getItem('datasetId') || '0'
  }
  const { data: data, isLoading } = useQuery({
    queryKey: ['datasets', id],
    queryFn: () => datasetsApi.getById(Number(id))
  })
  const dataset = data as Dataset | undefined

  const currentData = useMemo(() => {
    if (!dataset) return []
    
    if (dataset.name === 'china') {
      const provinceData = (dataset.data as DatasetData)[selectedProvince]
      return selectedProvince && provinceData ? provinceData.map(item => {
        const cityName = Object.keys(item)[0]
        const cityData = item[cityName]
        return {
          [cityName]: {
            ...cityData,
            TimePoint: cityData.TimePoint
          }
        }
      }) : []
    } else if ('hour' in dataset.data) {
      const data = dataset.data as { hour: any[], day: any[] }
      const timeData = data[selectedTimeRange as keyof typeof data] || []
      return timeData.map(item => {
        // 转换时间为北京时间
        const timestamp = parseInt(item.TimePoint.replace('/Date(', '').replace(')/', ''))
        const date = new Date(timestamp)
        // 转换为北京时间（UTC+8）
        date.setHours(date.getHours() + 8)
        const formattedTime = date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-')

        if (selectedTimeRange === 'day') {
          return {
            [item.TimePoint]: {
              Area: item.Area,
              TimePoint: formattedTime,
              AQI: item.AQI,
              Quality: item.Quality,
              PrimaryPollutant: item.PrimaryPollutant,
              PM2_5: item.PM2_5_24h,
              PM10: item.PM10_24h,
              SO2: item.SO2_24h,
              NO2: item.NO2_24h,
              O3: item.O3_8h_24h,
              CO: item.CO_24h
            }
          }
        } else {
          return {
            [item.TimePoint]: {
              Area: item.Area,
              TimePoint: formattedTime,
              AQI: item.AQI,
              Quality: item.Quality,
              PrimaryPollutant: item.PrimaryPollutant,
              PM2_5: item.PM2_5,
              PM10: item.PM10,
              SO2: item.SO2,
              NO2: item.NO2,
              O3: item.O3,
              CO: item.CO
            }
          }
        }
      })
    } else {
      return (dataset.data as CityData[]).map(item => {
        const cityName = Object.keys(item)[0]
        const cityData = item[cityName]
        return {
          [cityName]: {
            ...cityData,
            TimePoint: cityData.TimePoint
          }
        }
      })
    }
  }, [dataset, selectedProvince, selectedTimeRange])

  const totalItems = currentData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentItems = currentData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  // 当选择新的省份时重置页码
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    setPage(1)
  }

  if (isLoading) {
    return (
      <>
        <Header>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </Header>
        <Main className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
        </Main>
      </>
    )
  }

  if (!dataset) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">数据集未找到</h2>
          <p className="text-sm text-muted-foreground">该数据集可能已被删除或移动</p>
          <Button variant="link" asChild className="mt-4">
            <Link to="/apps/datasets">返回数据集列表</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/apps/datasets">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{dataset.name}</h2>
                <Badge variant="outline">{dataset.file_type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {dataset.description || '暂无描述'}
              </p>
            </div>
          </div>
        </div>
      </Header>

      <Main className="space-y-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="preview">数据预览</TabsTrigger>
            <TabsTrigger value="schema">数据结构</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">文件类型</CardTitle>
                  <FileType className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dataset.file_type}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">数据行数</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dataset.row_count}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">文件大小</CardTitle>
                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatFileSize(dataset.file_size)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">创建时间</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Date(dataset.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 添加数据集详细信息卡片 */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>数据集信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">数据集名称</span>
                      <span className="text-sm text-muted-foreground">{dataset.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">描述</span>
                      <span className="text-sm text-muted-foreground">{dataset.description || '暂无描述'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">状态</span>
                      <Badge variant={dataset.status === 'ready' ? 'default' : dataset.status === 'error' ? 'destructive' : 'secondary'}>
                        {dataset.status === 'ready' ? '就绪' : dataset.status === 'processing' ? '处理中' : '错误'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>数据统计</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">数据总量</span>
                      <span className="text-sm text-muted-foreground">{dataset.row_count} 条</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">存储大小</span>
                      <span className="text-sm text-muted-foreground">{formatFileSize(dataset.file_size)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">文件格式</span>
                      <Badge variant="outline">{dataset.file_type}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">创建日期</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(dataset.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className='text-2xl'>数据预览</CardTitle>
                {dataset.name === 'china' ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedProvince}
                      onValueChange={handleProvinceChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择省份" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(dataset.data).map(province => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : 'hour' in dataset.data ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedTimeRange}
                      onValueChange={handleTimeRangeChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择时间范围" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hour">小时数据</SelectItem>
                        <SelectItem value="day">天数据</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {'hour' in dataset.data ? (
                            <>
                              <TableHead>地区</TableHead>
                              <TableHead>时间</TableHead>
                            </>
                          ) : (
                            <>
                              <TableHead>城市</TableHead>
                              <TableHead>时间</TableHead>
                            </>
                          )}
                          <TableHead>AQI</TableHead>
                          <TableHead>空气质量</TableHead>
                          <TableHead>主要污染物</TableHead>
                          <TableHead>PM2.5</TableHead>
                          <TableHead>PM10</TableHead>
                          <TableHead>SO2</TableHead>
                          <TableHead>NO2</TableHead>
                          <TableHead>O3</TableHead>
                          <TableHead>CO</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((item: any, index: number) => {
                          const data = {
                            cityName: Object.keys(item)[0],
                            ...Object.values(item)[0] as {
                              TimePoint: string;
                              Area: string;
                              AQI: string;
                              Quality: string;
                              PrimaryPollutant: string;
                              PM2_5: string;
                              PM10: string;
                              SO2: string;
                              NO2: string;
                              O3: string;
                              CO: string;
                            }
                          }
                          return (
                            <TableRow key={index}>
                              {'hour' in dataset.data ? (
                                <>
                                  <TableCell>{data.Area}</TableCell>
                                  <TableCell className="font-medium">
                                    {data.TimePoint}
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell className="font-medium">{data.cityName}</TableCell>
                                  <TableCell>{data.TimePoint}</TableCell>
                                </>
                              )}
                              <TableCell>
                                <Badge variant={
                                  Number(data.AQI) <= 50 ? 'outline' :
                                    Number(data.AQI) <= 100 ? 'secondary' :
                                      'destructive'
                                }>{data.AQI}</Badge>
                              </TableCell>
                              <TableCell>{data.Quality}</TableCell>
                              <TableCell>{data.PrimaryPollutant || '无'}</TableCell>
                              <TableCell>{data.PM2_5}</TableCell>
                              <TableCell>{data.PM10}</TableCell>
                              <TableCell>{data.SO2}</TableCell>
                              <TableCell>{data.NO2}</TableCell>
                              <TableCell>{data.O3}</TableCell>
                              <TableCell>{data.CO}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="text-sm text-muted-foreground">
                      共 {totalItems} 条数据
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                      >
                        上一页
                      </Button>
                      <div className="text-sm">
                        第 {page} 页，共 {totalPages} 页
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                      >
                        下一页
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schema">
            <Card>
              <CardHeader>
                <CardTitle>数据结构</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>字段名</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>描述</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">id</TableCell>
                          <TableCell>数字</TableCell>
                          <TableCell>数据集唯一标识符</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">name</TableCell>
                          <TableCell>字符串</TableCell>
                          <TableCell>数据集名称</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">description</TableCell>
                          <TableCell>字符串 | null</TableCell>
                          <TableCell>数据集描述</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">file_type</TableCell>
                          <TableCell>字符串</TableCell>
                          <TableCell>文件类型</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">file_size</TableCell>
                          <TableCell>数字</TableCell>
                          <TableCell>文件大小（字节）</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">row_count</TableCell>
                          <TableCell>数字</TableCell>
                          <TableCell>数据行数</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">created_at</TableCell>
                          <TableCell>字符串</TableCell>
                          <TableCell>创建时间</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">status</TableCell>
                          <TableCell>字符串</TableCell>
                          <TableCell>数据集状态（ready | processing | error）</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">data</TableCell>
                          <TableCell>任意类型</TableCell>
                          <TableCell>数据集内容</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

function formatFileSize(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}