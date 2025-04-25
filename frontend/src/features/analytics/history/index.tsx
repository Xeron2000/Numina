import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ArrowUpDown } from 'lucide-react'
import { analyticsApi } from '@/api/analytics'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useNavigate } from '@tanstack/react-router'

// 修改每页显示数量为5条
const PAGE_SIZE = 5

interface Item {
  id: number;
  name: string;
  status: string;  // 更新这里使用 StatusType
  query_string: string;
  created_at: string;
  updated_at: string;
  owner_id: number;
  dataset_id: number;
}

interface Task {
  items: Item[]
  total: number
}

export default function AnalyticsHistory() {
  const [page, setPage] = useState(1)

  const { data: tasksResponse, isLoading, refetch } = useQuery({
    queryKey: ['analytics-tasks', page],
    queryFn: async () => {
      const response = await analyticsApi.getTasks()
      if (!response) {
        return {
          items: [],
          total: 0
        }
      }
      return response as unknown as Task
    },
  })

  // 修改分页逻辑
  const tasks = [...(tasksResponse?.items ?? [])].reverse()
  const total = tasksResponse?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)
  
  // 获取当前页的数据
  const startIndex = (page - 1) * PAGE_SIZE
  const currentPageTasks = tasks.slice(startIndex, startIndex + PAGE_SIZE)

  const navigate = useNavigate()
  
  const handleTaskClick = (task: Item) => {
    const queryData = JSON.parse(task.query_string)
    navigate({ 
      to: '/apps/visualizations',
      search: { analyticsData: JSON.stringify(queryData) }  // 使用 search 参数而不是 state
    })
  }

  const handleDelete = async (e: React.MouseEvent, taskId: number) => {
    e.stopPropagation() // 防止触发行点击事件
    try {
      if (window.confirm('确定要删除这个分析数据吗？')) {
        await analyticsApi.deleteTask(taskId)
        // 删除成功后刷新数据
        refetch()
      }
    } catch (error) {
      console.error('删除任务失败:', error)
    }
  }

  return (
    <>
      <Header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex flex-1 items-center space-x-4">
            <h2 className="text-lg font-semibold">分析历史</h2>
          </div>
        </div>
      </Header>

      <Main className="p-6">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8 flex items-center">
                    创建时间
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    没有找到分析记录
                  </TableCell>
                </TableRow>
              ) : (
                currentPageTasks.map((task) => (
                  <TooltipProvider key={task.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableRow 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleTaskClick(task)}
                        >
                          <TableCell>{task.name}</TableCell>
                          <TableCell>{task.status}</TableCell>
                          <TableCell>
                            {(() => {
                              const date = new Date(task.created_at)
                              date.setHours(date.getHours() + 8)
                              return format(date, 'yyyy-MM-dd HH:mm')
                            })()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => handleDelete(e, task.id)}
                            >
                              删除
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>点击查看分析详情</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages || 1 }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setPage(i + 1)}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(p => Math.min(totalPages || 1, p + 1))}
                  disabled={page === (totalPages || 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Main>
    </>
  )
}