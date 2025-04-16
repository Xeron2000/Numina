import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MapLegendProps extends React.HTMLAttributes<HTMLDivElement> {}

const legendItems = [
  { color: '#00ff00', label: '优' },
  { color: '#ffff00', label: '良' },
  { color: '#ff7e00', label: '轻度污染' },
  { color: '#ff0000', label: '中度污染' },
  { color: '#99004c', label: '重度污染' },
  { color: '#7e0023', label: '严重污染' },
]

export function MapLegend({ className, ...props }: MapLegendProps) {
  return (
    <div className={cn('', className)} {...props}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">空气质量指数(AQI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1">
                <div 
                  className="h-3 w-3 rounded-sm" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}