import {
  IconLayoutDashboard,
  IconDatabase,
  IconChartBar,
  IconChartPie,
  IconMap,
  IconSettings,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@clearair.com',
    avatar: '/avatars/default.jpg',
  },
  logo: {
    icon: Command,
    name: 'AirSight'
  },
  navGroups: [
    {
      title: '概览',
      items: [
        {
          icon: IconLayoutDashboard,
          title: '仪表盘',
          url: '/',
        },
      ],
    },
    {
      title: '数据分析',
      items: [
        {
          title: '数据集',
          url: '/apps/datasets',
          icon: IconDatabase,
          // items: [
            // {
              // title: '数据集列表',
              // url: '/apps/datasets',
            // },
            // {
            //   title: '上传数据集',
            //   url: '/apps/datasets/upload',
            // },
            // {
            //   title: '数据集详情',
            //   url: '/apps/datasets/$id',
            //   hidden: true,
            // }
          // ]
        },
        {
          title: '分析工具',
          icon: IconChartBar,
          items: [
            {
              title: '查询构建器',
              url: '/apps/analytics/builder',
            },
            {
              title: '分析记录',
              url: '/apps/analytics/history',
            },
            {
              title: '分析详情',
              url: '/apps/analytics/$id', // Changed from :id to $id
              hidden: true,
            }
          ]
        },
        {
          title: '数据可视化',
          icon: IconChartPie,
          items: [
            {
              title: '可视化列表',
              url: '/apps/visualizations',
            },
            {
              title: '创建可视化',
              url: '/apps/visualizations/create',
            },
            {
              title: '可视化详情',
              url: '/apps/visualizations/$id/view', // Changed from :id to $id
              hidden: true,
            },
            {
              title: '编辑可视化',
              url: '/apps/visualizations/$id/edit', // Changed from :id to $id
              hidden: true,
            }
          ]
        },
        {
          // title: '空间分析',
          icon: IconMap,
          // items: [
          //   {
          title: '地图分析',
          url: '/apps/geospatial/map',
          // },
          // {
          //   title: '热力分布',
          //   url: '/apps/geospatial/heatmap',
          // },
          // {
          //   title: '地理围栏',
          //   url: '/apps/geospatial/fences',
          // }
          // ]
        },
      ],
    },
    {
      title: '系统',
      items: [
        {
          title: '系统设置',
          url: '/settings',
          icon: IconSettings,
          items: [
            {
              title: '个人资料',
              url: '/settings',
            },
            {
              title: '账户设置',
              url: '/settings/account',
            },
            {
              title: '外观设置',
              url: '/settings/appearance',
            },
            // {
            //   title: '显示设置',
            //   url: '/settings/display',
            // },
            // {
            //   title: '通知设置',
            //   url: '/settings/notifications',
            // }
          ]
        },
      ],
    },
  ],
  teams: []
} as const
