import { Link } from '@tanstack/react-router'
import { BarChart3, LineChart, PieChart } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Visualization } from '@/api/visualizations'

const ChartIcons = {
  line: LineChart,
  bar: BarChart3,
  pie: PieChart,
}

interface VisualizationCardProps {
  visualization: Visualization
}

export function VisualizationCard({ visualization }: VisualizationCardProps) {
  const Icon = ChartIcons[visualization.type as keyof typeof ChartIcons]

  return (
    <Card className="group hover:border-primary/50">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center text-base">
          <Icon className="mr-2 h-4 w-4" />
          {visualization.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{visualization.description}</p>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-md border bg-muted/50" />
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link to={`/apps/visualizations/${visualization.id}/view`}>查看</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/apps/visualizations/${visualization.id}/edit`}>编辑</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}