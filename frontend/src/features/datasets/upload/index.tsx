import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Upload } from 'lucide-react'
import { datasetsApi } from '@/api/datasets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

export default function DatasetUpload() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [dataType, setDataType] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !dataType) return

    setUploading(true)
    try {
      // Create array from file
      const fileData = [file]
      
      // TODO: Add province selection to the form
      const province = "default" // This should come from a form field
      
      await datasetsApi.upload(fileData, province)
      toast({
        title: '上传成功',
        description: '数据集已成功上传',
      })
      navigate({ to: '/apps/datasets' })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '上传失败',
        description: '请检查文件格式或网络连接',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <Header>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => navigate({ to: '/apps/datasets' })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">上传数据集</h2>
            <p className="text-sm text-muted-foreground">
              支持上传 CSV 或 Excel 文件
            </p>
          </div>
        </div>
      </Header>

      <Main>
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="rounded-lg border bg-card text-card-foreground">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>数据类型</Label>
                  <Select value={dataType} onValueChange={setDataType}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择数据类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air_quality">空气质量数据</SelectItem>
                      <SelectItem value="weather">气象数据</SelectItem>
                      <SelectItem value="emission">排放源数据</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>选择文件</Label>
                  <div className="grid gap-4">
                    <div className="rounded-lg border border-dashed p-8">
                      <Input
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <Label
                        htmlFor="file-upload"
                        className="flex cursor-pointer flex-col items-center justify-center gap-2"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {file ? file.name : '点击或拖拽文件到此处上传'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          支持 CSV、Excel 文件
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 border-t bg-muted/40 p-4">
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/apps/datasets' })}
              >
                取消
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || !dataType || uploading}
              >
                {uploading ? '上传中...' : '上传'}
              </Button>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}