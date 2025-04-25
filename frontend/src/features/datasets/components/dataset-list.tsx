import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dataset } from '@/api/datasets'
import { useNavigate } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DatasetListProps {
  datasets: Dataset[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onDelete: (id: number) => void
}

// 文件大小格式化函数
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

export function DatasetList({ datasets, currentPage, totalPages, onPageChange, onDelete }: DatasetListProps) {
  const navigate = useNavigate()

  const handleRowClick = (id: number) => {
    sessionStorage.setItem('datasetId', String(id))
    navigate({ to: '/apps/datasets/$id', params: { id: String(id) } })
  }

  const getStatusBadgeVariant = (status: Dataset['status']) => {
    switch (status) {
      case 'ready':
        return 'default'
      case 'processing':
        return 'secondary'
      case 'error':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>文件类型</TableHead>
            <TableHead>文件大小</TableHead>
            <TableHead>行数</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.map((dataset) => (
            <TooltipProvider key={dataset.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableRow className="cursor-pointer">
                    <TableCell 
                      className="font-medium"
                      onClick={() => handleRowClick(dataset.id)}
                    >{dataset.name}</TableCell>
                    <TableCell onClick={() => handleRowClick(dataset.id)}>{dataset.description || '暂无描述'}</TableCell>
                    <TableCell onClick={() => handleRowClick(dataset.id)}>{dataset.file_type.toUpperCase()}</TableCell>
                    <TableCell onClick={() => handleRowClick(dataset.id)}>{formatFileSize(dataset.file_size)}</TableCell>
                    <TableCell onClick={() => handleRowClick(dataset.id)}>{dataset.row_count}</TableCell>
                    <TableCell onClick={() => handleRowClick(dataset.id)}>
                      <Badge variant={getStatusBadgeVariant(dataset.status)}>
                        {dataset.status === 'ready' ? '就绪' : 
                         dataset.status === 'processing' ? '处理中' : '错误'}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(dataset.id)}>
                      {(() => {
                        const date = new Date(dataset.created_at)
                        date.setHours(date.getHours() + 8)
                        return date.toLocaleString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })
                      })()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('确定要删除这个数据集吗？')) {
                            onDelete(dataset.id)
                          }
                        }}
                      >
                        删除
                      </Button>
                    </TableCell>
                  </TableRow>
                </TooltipTrigger>
                <TooltipContent>
                  <p>点击查看数据详情</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}