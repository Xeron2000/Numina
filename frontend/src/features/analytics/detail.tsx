import { useParams } from '@tanstack/react-router'
import { IconDownload, IconEdit } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function AnalyticsDetail() {
  const { id } = useParams({ from: '/_authenticated/apps/analytics/$id' })

  return (
    <>
      <Header>
        <h2 className="text-lg font-semibold">分析详情</h2>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <IconDownload size={16} className="mr-2" />
            导出
          </Button>
          <Button variant="outline" size="sm">
            <IconEdit size={16} className="mr-2" />
            编辑
          </Button>
        </div>
      </Header>

      <Main>
        <div>
          <h1 className="text-2xl font-bold">分析 #{id}</h1>
          <p className="text-muted-foreground">查看分析详情和结果</p>
        </div>

        {/* 这里添加分析详情内容 */}
      </Main>
    </>
  )
}