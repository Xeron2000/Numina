import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { IconPlus, IconSearch, IconEdit, IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

// 临时数据，后续替换为API调用
const mockVisualizations = [
  {
    id: 1,
    name: '空气质量趋势图',
    description: '展示2023年空气质量变化趋势',
    created_at: '2024-01-20',
    type: '折线图'
  },
]

export default function Visualizations() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <>
      <Header>
        <div className="flex items-center gap-4">
          <Input
            placeholder="搜索可视化..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
          <IconSearch size={18} className="text-muted-foreground" />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">可视化管理</h1>
            <p className="text-muted-foreground">创建和管理数据可视化</p>
          </div>
          <Button asChild>
            <Link to="./create">
              <IconPlus className="mr-2" size={18} />
              新建可视化
            </Link>
          </Button>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4">
          {mockVisualizations.map((viz) => (
            <div
              key={viz.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h3 className="font-semibold">{viz.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {viz.description}
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>创建时间: {viz.created_at}</span>
                  <span>类型: {viz.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link to={`/apps/visualizations/${viz.id}/view`}>
                    查看
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link to={`/apps/visualizations/${viz.id}/edit`}>
                    <IconEdit size={16} className="mr-2" />
                    编辑
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                >
                  <IconTrash size={16} className="mr-2" />
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Main>
    </>
  )
}