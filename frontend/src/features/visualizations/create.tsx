import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { IconGavel } from '@tabler/icons-react'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

export default function VisualizationCreate() {
  return (
    <>
      <Header>
        <h2 className="text-lg font-semibold">创建可视化</h2>
        <div className="ml-auto flex items-center gap-4">
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