import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function DatasetUpload() {
  const navigate = useNavigate()
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
      // TODO: 实现文件上传逻辑
      await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟上传延迟
      navigate({ to: '/apps/datasets' })
    } catch (error) {
      console.error('上传失败:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>上传数据集</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <Button
                onClick={handleUpload}
                disabled={!file || !dataType || uploading}
              >
                {uploading ? (
                  "上传中..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    上传
                  </>
                )}
              </Button>
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                已选择: {file.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}