import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function VisualizationCreate() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    dataset: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // TODO: 实现创建可视化的逻辑
      await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
      navigate({ to: '/apps/visualizations' })
    } catch (error) {
      console.error('创建失败:', error)
    }
  }

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>创建可视化</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="输入可视化标题"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="输入可视化描述"
              />
            </div>

            <div className="space-y-2">
              <Label>可视化类型</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择可视化类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">折线图</SelectItem>
                  <SelectItem value="bar">柱状图</SelectItem>
                  <SelectItem value="scatter">散点图</SelectItem>
                  <SelectItem value="pie">饼图</SelectItem>
                  <SelectItem value="heatmap">热力图</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>数据集</Label>
              <Select
                value={formData.dataset}
                onValueChange={(value) => setFormData(prev => ({ ...prev, dataset: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择数据集" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="air_quality">空气质量数据集</SelectItem>
                  <SelectItem value="weather">气象数据集</SelectItem>
                  <SelectItem value="emission">排放源数据集</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              创建可视化
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}