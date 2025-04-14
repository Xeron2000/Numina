import { useParams } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { IconEdit, IconDownload } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function VisualizationView() {
  const { id } = useParams({ from: '/_authenticated/apps/visualizations/$id/view' })

  return (
    <>
      <Header>
        <h2 className="text-lg font-semibold">查看可视化</h2>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <IconDownload size={16} className="mr-2" />
            导出
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/apps/visualizations/${id}/edit`}>
              <IconEdit size={16} className="mr-2" />
              编辑
            </Link>
          </Button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="rounded-lg border p-4">
          <div className="h-[calc(100vh-10rem)]">
            {/* 这里展示图表 */}
          </div>
        </div>
      </Main>
    </>
  )
}