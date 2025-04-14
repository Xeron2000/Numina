import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { IconPlus, IconSearch, IconTrash, IconEdit } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

// 临时数据，后续需要替换为API调用
const mockDatasets = [
  {
    id: 1,
    name: '空气质量数据集2023',
    description: '包含2023年全年的空气质量监测数据',
    created_at: '2024-01-15',
    file_type: 'CSV'
  },
  // ... 更多数据
]

export default function Datasets() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <>
      <Header>
        <div className="flex items-center gap-4">
          <Input
            placeholder="搜索数据集..."
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
            <h1 className="text-2xl font-bold">数据集管理</h1>
            <p className="text-muted-foreground">管理和分析您的数据集</p>
          </div>
          <Button asChild>
            <Link to="/apps/datasets/upload">
              <IconPlus className="mr-2" size={18} />
              上传数据集
            </Link>
          </Button>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-4">
          {mockDatasets.map((dataset) => (
            <div
              key={dataset.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h3 className="font-semibold">{dataset.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {dataset.description}
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span>创建时间: {dataset.created_at}</span>
                  <span>文件类型: {dataset.file_type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link to={`/apps/datasets/${dataset.id}`}>
                    <IconEdit size={16} className="mr-2" />
                    查看
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