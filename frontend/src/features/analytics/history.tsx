import { IconSearch } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function AnalyticsHistory() {
  return (
    <>
      <Header>
        <div className="flex items-center gap-4">
          <Input
            placeholder="搜索分析记录..."
            className="w-[300px]"
          />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div>
          <h1 className="text-2xl font-bold">分析历史</h1>
          <p className="text-muted-foreground">查看和管理已保存的分析查询</p>
        </div>

        {/* 这里添加历史记录列表 */}
      </Main>
    </>
  )
}