// import { Link } from '@tanstack/react-router'
import { FileSpreadsheet, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Dataset } from '@/api/datasets'

interface DatasetCardProps {
  dataset: Dataset
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  return (
    <Card className="group hover:border-primary/50">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {dataset.name}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem>
                <Link to={`/apps/datasets/${dataset.id}/edit`}>编辑</Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem className="text-destructive">删除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground">{dataset.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">文件类型</span>
            <span className="font-medium">{dataset.file_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">创建时间</span>
            <span className="font-medium">{new Date(dataset.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {/* <Button className="w-full" asChild>
          <Link to={`/apps/datasets/${dataset.id}/view`}>查看详情</Link>
        </Button> */}
      </CardFooter>
    </Card>
  )
}