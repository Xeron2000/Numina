import { useState } from 'react'
import { IconPray, IconGavel } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export default function AnalyticsBuilder() {
  return (
    <>
      <Header>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">分析构建器</h2>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">分析构建器</h1>
            <p className="text-muted-foreground">创建和执行数据分析查询</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <IconGavel className="mr-2" size={18} />
              保存查询
            </Button>
            <Button>
              <IconPray className="mr-2" size={18} />
              运行
            </Button>
          </div>
        </div>

        {/* 这里添加查询构建器界面 */}
      </Main>
    </>
  )
}