import { LucideIcon } from 'lucide-react'
import { Icon } from '@tabler/icons-react'

export type AppRoute =
  | '/'
  | '/dashboard'
  | '/apps/datasets'
  | '/apps/datasets/upload'
  | '/apps/datasets/$id'  // Changed from :id to $id to match TanStack Router
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
  | '/settings/display'
  | '/settings/notifications'
  | '/help-center'

export interface BaseNavItem {
  title: string
  icon?: Icon | LucideIcon
  hidden?: boolean  // Add hidden property here
}

export interface NavItem extends BaseNavItem {
  url?: AppRoute
  items?: NavItem[]
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

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
  teams: any[]
}

export interface SidebarItem {
  title: string
  url?: string
  icon?: Icon | LucideIcon
  items?: SidebarItem[]
  hidden?: boolean  // 新增属性
}
