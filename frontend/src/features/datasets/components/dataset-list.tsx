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

interface DatasetListProps {
  datasets: Dataset[]
}

// 文件大小格式化函数
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

export function DatasetList({ datasets }: DatasetListProps) {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {datasets.map((dataset) => (
          <TableRow
            key={dataset.id}
            className="cursor-pointer"
            onClick={() => handleRowClick(dataset.id)}
          >
            <TableCell className="font-medium">{dataset.name}</TableCell>
            <TableCell>{dataset.description || '暂无描述'}</TableCell>
            <TableCell>{dataset.file_type.toUpperCase()}</TableCell>
            <TableCell>{formatFileSize(dataset.file_size)}</TableCell>
            <TableCell>{dataset.row_count}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(dataset.status)}>
                {dataset.status === 'ready' ? '就绪' : 
                 dataset.status === 'processing' ? '处理中' : '错误'}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(dataset.created_at).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}