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
import { useTranslation } from 'react-i18next'

export default function DatasetUpload() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()
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
        title: t('upload.toast.success.title'),
        description: t('upload.toast.success.desc'),
      })
      navigate({ to: '/apps/datasets' })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('upload.toast.error.title'),
        description: t('upload.toast.error.desc'),
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
            <h2 className="text-lg font-semibold">{t('upload.title')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('upload.subtitle')}
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
                  <Label>{t('upload.data_type')}</Label>
                  <Select value={dataType} onValueChange={setDataType}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('upload.data_type.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air_quality">{t('upload.data_type.air_quality')}</SelectItem>
                      <SelectItem value="weather">{t('upload.data_type.weather')}</SelectItem>
                      <SelectItem value="emission">{t('upload.data_type.emission')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('upload.select_file')}</Label>
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
                          {file ? file.name : t('upload.drop_area')}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {t('upload.supported_types')}
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
                {t('upload.cancel')}
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || !dataType || uploading}
              >
                {uploading ? t('upload.uploading') : t('upload.upload')}
              </Button>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}