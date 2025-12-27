import { useQuery, useMutation } from '@tanstack/react-query'
import { settingsApi, LLMConfig } from '@/api/settings'
import { llmApi } from '@/api/llm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LLM_CONFIG_KEY = 'llm_config'

function loadLocalConfig(): LLMConfig {
  const saved = localStorage.getItem(LLM_CONFIG_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return {
        base_url: 'https://api.openai.com/v1',
        api_key: '',
        model: 'gpt-3.5-turbo',
        provider: 'openai'
      }
    }
  }
  return {
    base_url: 'https://api.openai.com/v1',
    api_key: '',
    model: 'gpt-3.5-turbo',
    provider: 'openai'
  }
}

export default function LLMSettings() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [config, setConfig] = useState<LLMConfig>(loadLocalConfig())
  const [models, setModels] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['llm-config'],
    queryFn: async () => {
      const response = await settingsApi.getLLMConfig()
      return response.data.data
    },
    enabled: false
  })

  useEffect(() => {
    if (data?.api_key) {
      setConfig(data)
    }
  }, [data])

  const fetchModels = async () => {
    if (!config.api_key) {
      toast({
        variant: 'destructive',
        title: t('settings.llm.toast.error'),
        description: t('settings.llm.toast.missing_key')
      })
      return
    }
    setLoadingModels(true)
    try {
      const modelList: string[] = await llmApi.getModels(config)
      setModels(modelList || [])
      toast({
        title: t('settings.llm.toast.success'),
        description: `获取到 ${modelList.length || 0} 个模型`
      })
    } catch (error) {
      setModels([])
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error('Failed to fetch models:', error)
      toast({
        variant: 'destructive',
        title: t('settings.llm.toast.error'),
        description: `获取模型列表失败: ${errorMsg}`
      })
    } finally {
      setLoadingModels(false)
    }
  }

  const mutation = useMutation({
    mutationFn: (data: LLMConfig) => settingsApi.updateLLMConfig(data),
    onSuccess: () => {
      localStorage.setItem(LLM_CONFIG_KEY, JSON.stringify(config))
      toast({
        title: t('settings.llm.toast.success'),
        description: t('settings.llm.toast.saved')
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('settings.llm.toast.error'),
        description: t('settings.llm.toast.failed')
      })
    }
  })

  const handleSave = () => {
    if (!config.api_key) {
      toast({
        variant: 'destructive',
        title: t('settings.llm.toast.error'),
        description: t('settings.llm.toast.missing_key')
      })
      return
    }
    mutation.mutate(config)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.llm.title')}</CardTitle>
        <CardDescription>{t('settings.llm.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="base_url">{t('settings.llm.base_url')}</Label>
          <Input
            id="base_url"
            value={config.base_url}
            onChange={(e) => setConfig({ ...config, base_url: e.target.value })}
            placeholder="https://api.openai.com/v1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="api_key">{t('settings.llm.api_key')}</Label>
          <Input
            id="api_key"
            type="password"
            value={config.api_key}
            onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
            placeholder="sk-..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">{t('settings.llm.model')}</Label>
          <div className="flex gap-2">
            <Select
              value={config.model}
              onValueChange={(value) => setConfig({ ...config, model: value })}
              disabled={models.length === 0}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="gpt-3.5-turbo" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchModels}
              disabled={loadingModels}
            >
              {loadingModels ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            填入 Key 和 Base URL 后点击刷新按钮获取可用模型
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider">{t('settings.llm.provider')}</Label>
          <Input
            id="provider"
            value={config.provider}
            onChange={(e) => setConfig({ ...config, provider: e.target.value })}
            placeholder="openai"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {t('settings.llm.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
