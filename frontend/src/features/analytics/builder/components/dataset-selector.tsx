import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { datasetsApi } from '@/api/datasets'

interface Dataset {
  id: number
  name: string
}

interface DatasetResponse {
  data: {
    items: Dataset[]
  }
}

interface DatasetSelectorProps {
  value: number | null
  onChange: (value: number) => void
}

export function DatasetSelector({ value, onChange }: DatasetSelectorProps) {
  const { data: datasets } = useQuery<DatasetResponse>({
    queryKey: ['datasets'],
    queryFn: () => datasetsApi.getAll()
  })

  const selectedDataset = datasets?.data.items.find((dataset) => dataset.id === value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selectedDataset ? selectedDataset.name : "选择数据集"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="搜索数据集..." />
          <CommandEmpty>未找到数据集</CommandEmpty>
          <CommandGroup>
            {datasets?.data.items.map((dataset) => (
              <CommandItem
                key={dataset.id}
                value={dataset.name}
                onSelect={() => onChange(dataset.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === dataset.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {dataset.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}