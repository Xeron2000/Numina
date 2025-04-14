import {
  IconBrowserCheck,
  IconDatabase,
  IconHelp,
  IconLayoutDashboard,
  IconNotification,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconChartBar,
  IconMap,
  IconChartPie,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  logo: {
    icon: Command,
    name: '空气质量监测平台'
  },
  navGroups: [
    {
      title: '主要功能',
      items: [
        {
          title: '仪表盘',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: '数据集',
          url: '/apps/datasets',
          icon: IconDatabase,
        },
        {
          title: '分析',
          icon: IconChartBar,
          items: [
            {
              title: '分析构建器',
              url: '/apps/analytics/builder',
            },
            {
              title: '历史记录',
              url: '/apps/analytics/history',
            }
          ]
        },
        {
          title: '可视化',
          icon: IconChartPie,
          url: '/apps/visualizations',
        },
        {
          title: '地理空间',
          icon: IconMap,
          items: [
            {
              title: '地图视图',
              url: '/apps/geospatial/map',
            },
            {
              title: '热力图',
              url: '/apps/geospatial/heatmap',
            },
            {
              title: '地理围栏',
              url: '/apps/geospatial/fences',
            }
          ]
        },
      ],
    },
    {
      title: '系统设置',
      items: [
        {
          title: '设置',
          icon: IconSettings,
          items: [
            {
              title: '个人信息',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: '账户设置',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: '外观设置',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: '通知设置',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: '显示设置',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: '帮助中心',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
  teams: []
}
