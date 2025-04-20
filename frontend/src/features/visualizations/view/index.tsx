import { useParams, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Edit2, Share2, MoreVertical, Download, Trash2 } from 'lucide-react'
import { visualizationsApi } from '@/api/visualizations'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'

export default function VisualizationView() {
  const { id } = useParams({ from: '/_authenticated/apps/visualizations/$id/view' })
  const navigate = useNavigate()
  
  const { data, isLoading } = useQuery({
    queryKey: ['visualization', id],
    queryFn: () => visualizationsApi.getById(Number(id))
  })

  if (isLoading) {
    return (
      <>
        <Header className="border-b">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
          </div>
        </Header>
        <Main className="space-y-8">
          <Card className="p-6">
            <Skeleton className="aspect-video rounded-lg" />
          </Card>
        </Main>
      </>
    )
  }

  const visualization = data?.data
  
  if (!visualization) {
    return (
      <>
        <Header className="border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/apps/visualizations' })}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-semibold">可视化不存在</h2>
              <p className="text-sm text-muted-foreground">
                请检查链接是否正确
              </p>
            </div>
          </div>
        </Header>
        <Main className="flex items-center justify-center">
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              未找到ID为 {id} 的可视化
            </p>
          </Card>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header className="border-b">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/apps/visualizations' })}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{visualization.name}</h2>
                <Badge variant={
                  visualization.type === 'line' ? 'default' :
                  visualization.type === 'bar' ? 'secondary' :
                  visualization.type === 'pie' ? 'destructive' :
                  visualization.type === 'scatter' ? 'outline' : 'default'
                }>
                  {visualization.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {visualization.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              分享
            </Button>
            <Button variant="outline" size="sm" onClick={() => 
              navigate({ to: `/apps/visualizations/${id}/edit` })
            }>
              <Edit2 className="mr-2 h-4 w-4" />
              编辑
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  导出数据
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Header>

      <Main className="space-y-8">
        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="data">数据</TabsTrigger>
            <TabsTrigger value="settings">配置</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <Card className="p-6">
              <div className="aspect-video rounded-lg border bg-muted/50">
                {/* TODO: 根据 visualization.type 和 config 渲染对应的图表 */}
              </div>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium">数据集</h3>
                <p className="mt-1 text-2xl font-bold">Dataset #{visualization.dataset_id}</p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium">创建时间</h3>
                <p className="mt-1 text-2xl font-bold">
                  {new Date(visualization.created_at).toLocaleDateString('zh-CN')}
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium">更新时间</h3>
                <p className="mt-1 text-2xl font-bold">
                  {new Date(visualization.updated_at).toLocaleDateString('zh-CN')}
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-medium">创建者</h3>
                <p className="mt-1 text-2xl font-bold">User #{visualization.owner_id}</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data">
            <Card className="p-6">
              {/* TODO: 展示可视化使用的数据表格 */}
              <div className="h-[500px] rounded-lg border bg-muted/50" />
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <pre className="rounded-lg bg-muted p-4">
                {JSON.stringify(visualization.config, null, 2)}
              </pre>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}