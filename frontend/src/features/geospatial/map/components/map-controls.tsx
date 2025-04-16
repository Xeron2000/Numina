import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'

export function MapControls() {
  const [layers, setLayers] = useState({
    heatmap: true,
    points: true,
    labels: true,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">图层控制</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {Object.entries(layers).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                {value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {key}
              </Label>
              <Switch
                checked={value}
                onCheckedChange={(checked) => setLayers((prev) => ({ ...prev, [key]: checked }))}
              />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label>透明度</Label>
          <Slider defaultValue={[50]} max={100} step={1} />
        </div>
      </CardContent>
    </Card>
  )
}