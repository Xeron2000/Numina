import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeft, ChevronRight, Loader2 } from 'lucide-react'
import { visualizationsApi } from '@/api/visualizations'
import { datasetsApi } from '@/api/datasets'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(1, '请输入名称'),
  description: z.string().default(''), // Change to required with default empty string
  type: z.enum(['line', 'bar', 'pie', 'scatter', 'map']),
  dataset_id: z.number(),
  config: z.record(z.any()).default({}),
})

type FormValues = z.infer<typeof formSchema>

const chartTypes = [
  { value: 'line', label: '折线图', description: '展示数据随时间的变化趋势' },
  { value: 'bar', label: '柱状图', description: '比较不同类别的数值大小' },
  { value: 'pie', label: '饼图', description: '展示数据的占比分布' },
  { value: 'scatter', label: '散点图', description: '分析两个变量之间的关系' },
  { value: 'map', label: '地图', description: '展示地理空间数据分布' },
]

export default function VisualizationCreate() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [step, setStep] = useState<'info' | 'type' | 'config'>('info')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '', // Ensure description has a default value
      type: 'line' as const, // Add default chart type
      config: {},
    },
  })

  const { data: datasetsData } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => datasetsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: FormValues) => visualizationsApi.create(data),
    onSuccess: (response) => {
      toast({
        title: '创建成功',
        description: '可视化已创建，即将跳转到详情页',
      })
      navigate({ to: `/apps/visualizations/${response.data.id}` })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '创建失败',
        description: '请检查输入并重试',
      })
    },
  })

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data)
  }

  return (
    <>
      <Header className="border-b">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/apps/visualizations' })}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">创建可视化</h2>
              <p className="text-sm text-muted-foreground">
                创建新的数据可视化图表
              </p>
            </div>
          </div>
        </div>
      </Header>

      <Main className="max-w-5xl mx-auto py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 'info' && (
              <Card className="p-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>名称</FormLabel>
                        <FormControl>
                          <Input placeholder="输入可视化名称" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>描述</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="描述这个可视化的用途..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataset_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>数据集</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择数据集" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {datasetsData?.data.items.map((dataset) => (
                              <SelectItem
                                key={dataset.id}
                                value={dataset.id.toString()}
                              >
                                {dataset.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setStep('type')}
                      disabled={!form.getValues('dataset_id')}
                    >
                      下一步
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {step === 'type' && (
              <Card className="p-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>图表类型</FormLabel>
                        <div className="grid gap-4 pt-2">
                          {chartTypes.map((type) => (
                            <div
                              key={type.value}
                              className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                                field.value === type.value
                                  ? 'border-primary bg-primary/5'
                                  : ''
                              }`}
                              onClick={() => field.onChange(type.value)}
                            >
                              <div className="flex-1 space-y-1">
                                <p className="font-medium">{type.label}</p>
                                <p className="text-sm text-muted-foreground">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('info')}
                    >
                      上一步
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep('config')}
                      disabled={!form.getValues('type')}
                    >
                      下一步
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {step === 'config' && (
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-medium">图表配置</h3>
                      {/* TODO: 根据不同的图表类型显示不同的配置选项 */}
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">预览</h3>
                      <div className="aspect-video rounded-lg border bg-muted/50">
                        {/* TODO: 实时预览图表 */}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('type')}
                    >
                      上一步
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      创建可视化
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </form>
        </Form>
      </Main>
    </>
  )
}