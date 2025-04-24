import { FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'

export function EmptyState() {
  const navigate = useNavigate()
  
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileSpreadsheet className="h-10 w-10" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">没有数据集</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          开始上传您的第一个数据集。您可以上传 CSV 或 Excel 文件。
        </p>
        <div className="flex gap-2">
          <Button onClick={() => navigate({ to: '/apps/geospatial/map' })}>
            上传数据集
          </Button>
        </div>
      </div>
    </div>
  )
}