import { LucideIcon } from 'lucide-react'
import { Icon } from '@tabler/icons-react'

export type AppRoute =
  | '/'
  | '/dashboard'
  | '/apps/datasets'
  | '/apps/datasets/upload'
  | '/apps/datasets/$id'
  | '/apps/analytics/builder'
  | '/apps/analytics/history'
  | '/apps/analytics/$id'
  | '/apps/visualizations'
  | '/apps/visualizations/create'
  | '/apps/visualizations/$id/view'
  | '/apps/visualizations/$id/edit'
  | '/apps/geospatial/map'
  | '/apps/geospatial/heatmap'
  | '/apps/geospatial/fences'
  | '/settings'
  | '/settings/account'
  | '/settings/appearance'
  | '/settings/llm'
  | '/settings/display'
  | '/settings/notifications'
  | '/help-center'

// 基础导航项接口
export interface BaseNavItem {
  title: string
  icon?: Icon | LucideIcon
  hidden?: boolean
  badge?: string | number // 添加 badge 属性
}

// 导航项接口
export interface NavItem extends BaseNavItem {
  url?: AppRoute
  items?: NavItem[]
}

// 带链接的导航项接口
export interface NavLink extends NavItem {
  url: AppRoute // 必需的 URL
  items?: never // 不允许有子项
}

// 可折叠导航项接口
export interface NavCollapsible extends NavItem {
  url?: never // 不允许有 URL
  items: NavItem[] // 必需的子项数组
}

// 导航组接口
export interface NavGroup {
  title: string
  items: NavItem[]
}

// 侧边栏数据接口
export interface SidebarData {
  user: {
    name: string
    email: string
    avatar: string
  }
  logo: {
    icon: LucideIcon
    name: string
  }
  navGroups: NavGroup[]
  teams: {
    id: string | number
    name: string
    avatar?: string
  }[] // 明确定义 teams 类型
}

// 移除重复的 SidebarItem 接口，因为已经有了 NavItem
