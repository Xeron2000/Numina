import { LucideIcon } from 'lucide-react'
import { Icon } from '@tabler/icons-react'

export type AppRoute =
  | '/'
  | '/dashboard'
  | '/apps/datasets'
  | '/apps/datasets/upload'
  | '/apps/analytics/builder'
  | '/apps/analytics/history'
  | '/apps/visualizations'
  | '/apps/visualizations/create'
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
