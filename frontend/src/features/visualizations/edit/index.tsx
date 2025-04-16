import { useParams, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { visualizationsApi } from '@/api/visualizations'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

export default function VisualizationEdit() {
  const { id } = useParams({ from: '/_authenticated/apps/visualizations/$id/edit' })
  const navigate = useNavigate()
  
  const { data, isLoading } = useQuery({
    queryKey: ['visualization', id],
    queryFn: () => visualizationsApi.getById(Number(id))
  })

  const mutation = useMutation({
    mutationFn: (data: any) => visualizationsApi.update(Number(id), data),
    onSuccess: () => {
      toast({
        title: '更新成功',
        description: '可视化已成功更新。'
      })
      navigate({ to: '/apps/visualizations' })
    }
  })

  if (isLoading) {
    return <div>加载中...</div>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    mutation.mutate({
      name: data?.data.name,
      description: data?.data.description,
      type: data?.data.type,
      config: data?.data.config
    })
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>编辑可视化</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">名称</Label>
              <Input
                id="name"
                defaultValue={data?.data.name}
                placeholder="输入可视化名称"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                defaultValue={data?.data.description}
                placeholder="输入可视化描述"
              />
            </div>

            <div className="space-y-2">
              <Label>可视化类型</Label>
              <Select defaultValue={data?.data.type}>
                <SelectTrigger>
                  <SelectValue placeholder="选择可视化类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">折线图</SelectItem>
                  <SelectItem value="bar">柱状图</SelectItem>
                  <SelectItem value="scatter">散点图</SelectItem>
                  <SelectItem value="pie">饼图</SelectItem>
                  <SelectItem value="map">地图</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              保存更改
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}