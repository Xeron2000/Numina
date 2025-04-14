import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function GeospatialFences() {
  return (
    <>
      <Header>
        <h2 className="text-lg font-semibold">地理围栏</h2>
        <div className="ml-auto flex items-center gap-2">
          <Button>
            <IconPlus size={16} className="mr-2" />
            新建围栏
          </Button>
          <Button variant="outline" size="sm">
            <IconRefresh size={16} className="mr-2" />
            刷新
          </Button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="grid gap-4">
          <div className="h-[calc(100vh-14rem)] w-full rounded-lg border">
            {/* 这里集成地图和围栏编辑组件 */}
          </div>
        </div>
      </Main>
    </>
  )
}