import { Link } from '@tanstack/react-router'
import { FileSpreadsheet, MoreVertical } from 'lucide-react'
import type { Dataset } from '@/api/datasets'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface DatasetListProps {
  datasets: Dataset[]
}

export function DatasetList({ datasets }: DatasetListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>大小</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.map((dataset) => (
            <TableRow key={dataset.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                  <Link
                    to={`/apps/datasets/${dataset.id}`}
                    className="font-medium hover:underline"
                  >
                    {dataset.name}
                  </Link>
                </div>
              </TableCell>
              <TableCell>{dataset.file_type}</TableCell>
              <TableCell>{formatFileSize(dataset.size)}</TableCell>
              <TableCell>
                <DatasetStatus status={dataset.status} />
              </TableCell>
              <TableCell>{new Date(dataset.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <DatasetActions dataset={dataset} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function DatasetStatus({ status }: { status: Dataset['status'] }) {
  const variants = {
    ready: 'bg-green-50 text-green-700 border-green-300',
    processing: 'bg-blue-50 text-blue-700 border-blue-300',
    error: 'bg-red-50 text-red-700 border-red-300',
  }

  const labels = {
    ready: '就绪',
    processing: '处理中',
    error: '错误',
  }

  return (
    <Badge variant="outline" className={variants[status]}>
      {labels[status]}
    </Badge>
  )
}

function DatasetActions({ dataset }: { dataset: Dataset }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/apps/datasets/${dataset.id}/edit`}>编辑</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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

  return `${size.toFixed(2)} ${units[unitIndex]}`
}