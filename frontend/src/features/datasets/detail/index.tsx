import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, FileSpreadsheet, Calendar, Database, FileType } from 'lucide-react'
import { datasetsApi } from '@/api/datasets'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DatasetDetail() {
  const { id } = useParams({ from: '/_authenticated/apps/datasets/$id' })
  const { data: dataset, isLoading } = useQuery({
    queryKey: ['datasets', id],
    queryFn: () => datasetsApi.getById(Number(id))
  })

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
                <h2 className="text-lg font-semibold">{dataset.data.name}</h2>
                <Badge variant="outline">{dataset.data.file_type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {dataset.data.description || '暂无描述'}
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
                  <div className="text-2xl font-bold">{dataset.data.file_type}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">数据行数</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dataset.data.row_count}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">文件大小</CardTitle>
                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatFileSize(dataset.data.file_size)}
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
                    {new Date(dataset.data.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>数据预览</CardTitle>
              </CardHeader>
              <CardContent>
                {/* TODO: 添加数据预览组件 */}
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    {/* 这里添加数据表格组件 */}
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
                {/* TODO: 添加数据结构展示组件 */}
                <div className="space-y-4">
                  {/* 这里添加字段列表组件 */}
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