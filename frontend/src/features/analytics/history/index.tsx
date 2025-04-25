import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { ArrowUpDown} from 'lucide-react'
import { analyticsApi } from '@/api/analytics'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'

const PAGE_SIZE = 10

const statusMap = {
  pending: { label: '等待中', color: 'bg-yellow-500/20 text-yellow-500' },
  running: { label: '运行中', color: 'bg-blue-500/20 text-blue-500' },
  completed: { label: '已完成', color: 'bg-green-500/20 text-green-500' },
  failed: { label: '失败', color: 'bg-red-500/20 text-red-500' },
}

export default function AnalyticsHistory() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data: tasksResponse, isLoading } = useQuery({
    queryKey: ['analytics-tasks', page, search],
    queryFn: () => analyticsApi.getTasks(),
  })

  const tasks = tasksResponse?.data?.items || []
  const total = tasksResponse?.data?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <>
      <Header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex flex-1 items-center space-x-4">
            <h2 className="text-lg font-semibold">分析历史</h2>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="w-64">
              <Input
                placeholder="搜索查询..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/apps/analytics/builder">新建查询</Link>
            </Button>
          </div>
        </div>
      </Header>

      <Main className="p-6">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8 flex items-center">
                    创建时间
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
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
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-mono">#{task.id}</TableCell>
                    <TableCell>
                      <Link
                        to="/apps/analytics/$id"
                        params={{ id: String(task.id) }}
                        className="hover:underline"
                      >
                        {task.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {format(new Date(task.created_at), 'yyyy-MM-dd HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={statusMap[task.status].color}
                      >
                        {statusMap[task.status].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
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
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Main>
    </>
  )
}