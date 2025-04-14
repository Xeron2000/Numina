import { IconDownload, IconRefresh } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function GeospatialMap() {
  return (
    <>
      <Header>
        <h2 className="text-lg font-semibold">地图视图</h2>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <IconDownload size={16} className="mr-2" />
            导出
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
        <div className="h-[calc(100vh-10rem)] w-full rounded-lg border">
          {/* 这里集成地图组件，如 Mapbox GL JS 或 Leaflet */}
        </div>
      </Main>
    </>
  )
}