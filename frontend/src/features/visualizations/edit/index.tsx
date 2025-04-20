import { useParams, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import { visualizationsApi } from '@/api/visualizations'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(1, '请输入名称'),
  description: z.string().default(''),
  type: z.enum(['line', 'bar', 'pie', 'scatter', 'map']),
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

export default function VisualizationEdit() {
  const { id } = useParams({ from: '/_authenticated/apps/visualizations/$id/edit' })
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ['visualization', id],
    queryFn: () => visualizationsApi.getById(Number(id))
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.data.name || '',
      description: data?.data.description || '',
      type: data?.data.type || 'line',
      config: data?.data.config || {},
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<FormValues>) => visualizationsApi.update(Number(id), data),
    onSuccess: () => {
      toast({
        title: '更新成功',
        description: '可视化已成功更新',
      })
      navigate({ to: `/apps/visualizations/${id}` })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: '更新失败',
        description: '请检查输入并重试',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => visualizationsApi.delete(Number(id)),
    onSuccess: () => {
      toast({
        title: '删除成功',
        description: '可视化已被删除',
      })
      navigate({ to: '/apps/visualizations' })
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!data?.data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">可视化不存在或已被删除</p>
      </div>
    )
  }

  return (
    <>
      <Header className="border-b">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: `/apps/visualizations/${id}` })}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">编辑可视化</h2>
              <p className="text-sm text-muted-foreground">
                修改可视化的配置和样式
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作将永久删除该可视化，无法恢复。是否继续？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              onClick={() => navigate({ to: `/apps/visualizations/${id}` })}
              variant="outline"
              size="sm"
            >
              预览
            </Button>
          </div>
        </div>
      </Header>

      <Main className="max-w-5xl mx-auto py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-8">
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

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate({ to: `/apps/visualizations/${id}` })}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    保存更改
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </Form>
      </Main>
    </>
  )
}