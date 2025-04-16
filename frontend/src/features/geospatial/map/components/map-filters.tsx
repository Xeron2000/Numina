import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { DateRangePicker } from '../../components/date-range-picker'

export function MapFilters() {
  const [timeRange, setTimeRange] = useState<[Date | undefined, Date | undefined]>([
    undefined,
    undefined,
  ])

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle>筛选条件</SheetTitle>
        <SheetDescription>
          设置地图显示的数据筛选条件
        </SheetDescription>
      </SheetHeader>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>数据类型</Label>
          <RadioGroup defaultValue="aqi" className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="aqi" id="aqi" className="peer sr-only" />
              <Label
                htmlFor="aqi"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>AQI</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="pm25" id="pm25" className="peer sr-only" />
              <Label
                htmlFor="pm25"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>PM2.5</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="pm10" id="pm10" className="peer sr-only" />
              <Label
                htmlFor="pm10"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>PM10</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>时间范围</Label>
          <DateRangePicker 
            value={timeRange}
            onChange={setTimeRange}
          />
        </div>

        <div className="space-y-2">
          <Label>数据聚合</Label>
          <Select defaultValue="hour">
            <SelectTrigger>
              <SelectValue placeholder="选择数据聚合方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hour">按小时</SelectItem>
              <SelectItem value="day">按天</SelectItem>
              <SelectItem value="week">按周</SelectItem>
              <SelectItem value="month">按月</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SheetFooter>
        <Button className="w-full">应用筛选</Button>
      </SheetFooter>
    </div>
  )
}