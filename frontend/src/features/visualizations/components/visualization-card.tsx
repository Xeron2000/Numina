import { useNavigate } from '@tanstack/react-router'
import { MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react'
import type { Visualization } from '@/api/visualizations'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface VisualizationCardProps {
  visualization: Visualization
  viewMode: 'grid' | 'list'
}

export function VisualizationCard({ visualization, viewMode }: VisualizationCardProps) {
  // Remove unused navigate declaration since it's only used in CardActions
  if (viewMode === 'list') {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-muted rounded-md" />
          <div>
            <h3 className="font-medium">{visualization.name}</h3>
            <p className="text-sm text-muted-foreground">{visualization.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              创建于 {new Date(visualization.created_at).toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>
        <CardActions visualization={visualization} />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="aspect-video bg-muted rounded-md" />
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate">{visualization.name}</h3>
          <CardActions visualization={visualization} />
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {visualization.description}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          创建于 {new Date(visualization.created_at).toLocaleDateString('zh-CN')}
        </p>
      </div>
    </div>
  )
}

function CardActions({ visualization }: { visualization: Visualization }) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate({ 
          to: `/apps/visualizations/${visualization.id}` 
        })}>
          <ExternalLink className="mr-2 h-4 w-4" />
          查看详情
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ 
          to: `/apps/visualizations/${visualization.id}/edit` 
        })}>
          <Edit2 className="mr-2 h-4 w-4" />
          编辑
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={() => {
          // TODO: 实现删除功能
        }}>
          <Trash2 className="mr-2 h-4 w-4" />
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}