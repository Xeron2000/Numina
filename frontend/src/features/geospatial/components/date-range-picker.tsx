import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format, startOfMonth } from "date-fns"
import { zhCN } from 'date-fns/locale'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateRangePickerProps {
  value: [Date | undefined, Date | undefined]
  onChange: (value: [Date | undefined, Date | undefined]) => void
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [from, to] = value

  const presets = React.useMemo(() => [
    {
      label: "今天",
      value: [new Date(), new Date()] as [Date, Date],
    },
    {
      label: "昨天",
      value: [addDays(new Date(), -1), addDays(new Date(), -1)] as [Date, Date],
    },
    {
      label: "最近7天",
      value: [addDays(new Date(), -7), new Date()] as [Date, Date],
    },
    {
      label: "最近30天",
      value: [addDays(new Date(), -30), new Date()] as [Date, Date],
    },
    {
      label: "本月",
      value: [startOfMonth(new Date()), new Date()] as [Date, Date],
    }
  ], [])

  const handleSelect = React.useCallback((range: { from?: Date; to?: Date } | undefined) => {
    onChange([range?.from, range?.to])
  }, [onChange])

  const handlePresetChange = React.useCallback((value: string) => {
    const preset = presets.find((preset) => preset.label === value)
    if (preset) {
      onChange(preset.value)
    }
  }, [presets, onChange])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from ? (
              to ? (
                <>
                  {format(from, "yyyy年MM月dd日", { locale: zhCN })} - {format(to, "yyyy年MM月dd日", { locale: zhCN })}
                </>
              ) : (
                format(from, "yyyy年MM月dd日", { locale: zhCN })
              )
            ) : (
              <span>选择日期范围</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger className="w-[160px] border-none">
                <SelectValue placeholder="选择预设范围" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem key={preset.label} value={preset.label}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="rounded-md border">
              <Calendar
                mode="range"
                selected={{ from, to }}
                onSelect={handleSelect}
                numberOfMonths={2}
                defaultMonth={from}
                locale={zhCN}
                disabled={{ after: new Date() }}
                showOutsideDays={false}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}