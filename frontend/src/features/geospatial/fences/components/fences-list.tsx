import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function FencesList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">围栏列表</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* TODO: Add fence list items */}
        <div className="text-sm text-muted-foreground">
          暂无地理围栏
        </div>
      </CardContent>
    </Card>
  )
}