import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { IconUpload, IconX } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <>
      <Header>
        <h2 className="text-lg font-semibold">上传数据集</h2>
      </Header>

      <Main>
        <div className="mx-auto max-w-2xl">
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">数据集名称</label>
              <Input placeholder="输入数据集名称" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">描述</label>
              <Textarea placeholder="描述这个数据集..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">文件类型</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择文件类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">上传文件</label>
              <div className="flex items-center justify-center rounded-lg border border-dashed p-6">
                {file ? (
                  <div className="flex items-center gap-2">
                    <span>{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                    >
                      <IconX size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <IconUpload className="mx-auto mb-2" size={24} />
                    <label className="cursor-pointer text-sm text-muted-foreground">
                      <span className="text-primary">点击上传</span>
                      或拖拽文件到这里
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/apps/datasets' })}
              >
                取消
              </Button>
              <Button type="submit">上传</Button>
            </div>
          </form>
        </div>
      </Main>
    </>
  )
}