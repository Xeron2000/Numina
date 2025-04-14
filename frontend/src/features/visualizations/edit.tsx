import { useParams } from '@tanstack/react-router'
import { IconGavel, IconPlayerPlay } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function VisualizationEdit() {
  // 从路由参数中获取可视化ID
  const { id } = useParams({ from: '/_authenticated/apps/visualizations/$id/edit' })
  console.log('当前编辑的可视化ID:', id)

  return (
    <>
      <Header>
        <h2 className="text-lg font-semibold">编辑可视化</h2>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline">
            <IconPlayerPlay size={16} className="mr-2" />
            预览
          </Button>
          <Button>
            <IconGavel size={16} className="mr-2" />
            保存
          </Button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="grid grid-cols-[2fr,1fr] gap-4">
          <div className="rounded-lg border p-4">
            {/* 可视化编辑区域 */}
            <div className="h-[calc(100vh-12rem)]">
              {/* 这里集成图表编辑器 */}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            {/* 配置面板 */}
            <h3 className="font-semibold">配置</h3>
          </div>
        </div>
      </Main>
    </>
  )
}