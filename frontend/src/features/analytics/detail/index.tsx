import { useParams } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ArrowLeft, MoreVertical, Play, Download, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { analyticsApi } from '@/api/analytics'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { QueryResult } from '../builder/components/query-result'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useState } from 'react'

const statusMap = {
  pending: { label: '等待中', color: 'bg-yellow-500/20 text-yellow-500' },
  running: { label: '运行中', color: 'bg-blue-500/20 text-blue-500' },
  completed: { label: '已完成', color: 'bg-green-500/20 text-green-500' },
  failed: { label: '失败', color: 'bg-red-500/20 text-red-500' },
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '-'
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm')
  } catch {
    return '-'
  }
}

export default function AnalyticsDetail() {
  const { id } = useParams({ from: '/_authenticated/apps/analytics/$id' })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const { data: taskResponse, isLoading } = useQuery({
    queryKey: ['analytics-task', id],
    queryFn: () => analyticsApi.getTaskById(Number(id)),
  })

  const task = taskResponse?.data

  const { data: resultResponse, isLoading: isLoadingResult, refetch: refetchResult } = useQuery({
    queryKey: ['analytics-result', id],
    queryFn: () => analyticsApi.runQuery({
      dataset_id: task?.dataset_id!,
      query_string: task?.query_string!,
    }),
    enabled: !!task?.dataset_id && !!task?.query_string,
  })

  const result = resultResponse?.data

  const deleteTaskMutation = useMutation({
    mutationFn: () => analyticsApi.deleteTask(Number(id)),
    onSuccess: () => {
      toast.success('任务已删除')
      // 删除成功后跳转回列表页
      window.history.back()
    },
    onError: () => {
      toast.error('删除任务失败')
    },
  })

  const handleRerun = async () => {
    try {
      await analyticsApi.runQuery({
        dataset_id: task?.dataset_id!,
        query_string: task?.query_string!,
      })
      await refetchResult()
      toast.success('查询已重新运行')
    } catch (error) {
      toast.error('运行查询失败')
    }
  }

  const handleExport = () => {
    if (!result) {
      toast.error('没有可导出的数据')
      return
    }
    
    // 创建 CSV 内容
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      result?.rows && result.rows.length > 0 ? Object.keys(result.rows[0]).join(',') + '\n' : '' +
      Array.isArray(result.rows) ? result.rows.map(row => Object.values(row).join(',')).join('\n') : ''
    
    // 创建下载链接
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `分析结果_${task?.name}_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('结果已导出')
  }

  const handleDelete = () => {
    deleteTaskMutation.mutate()
  }

  if (isLoading) {
    return <DetailSkeleton />
  }

  return (
    <>
      <Header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex flex-1 items-center space-x-4">
            <Link
              to="/apps/analytics/history"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h2 className="text-lg font-semibold">{task?.name}</h2>
              <p className="text-sm text-muted-foreground">
                创建于 {formatDate(task?.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={statusMap[(task?.status || 'pending') as keyof typeof statusMap].color}>
              {statusMap[(task?.status || 'pending') as keyof typeof statusMap].label}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRerun}
              disabled={task?.status === 'running'}
            >
              <Play className="mr-2 h-4 w-4" />
              重新运行
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={task?.status !== 'completed'}
            >
              <Download className="mr-2 h-4 w-4" />
              导出结果
            </Button>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-red-600" 
                    onSelect={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除任务
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作将永久删除该分析任务，无法恢复。是否继续？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    disabled={deleteTaskMutation.isPending}
                  >
                    {deleteTaskMutation.isPending ? '删除中...' : '删除'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Header>

      <Main className="p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>查询详情</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="rounded-lg bg-muted p-4 overflow-auto">
                <code className="text-sm">{task?.query_string}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>执行结果</CardTitle>
            </CardHeader>
            <CardContent>
              <QueryResult data={result} isLoading={isLoadingResult} />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

function DetailSkeleton() {
  return (
    <>
      <Header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex flex-1 items-center space-x-4">
            <Skeleton className="h-9 w-9" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </Header>
      <Main className="p-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[400px] w-full" />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}