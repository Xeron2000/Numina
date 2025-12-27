import {
  IconLayoutDashboard,
  IconDatabase,
  IconChartBar,
  // IconChartPie,
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
      title: 'nav.group.overview',
      items: [
        {
          icon: IconLayoutDashboard,
          title: 'nav.dashboard',
          url: '/',
        },
      ],
    },
    {
      title: 'nav.group.analytics',
      items: [
        {
          // title: '空间分析',
          icon: IconMap,
          // items: [
          //   {
          title: 'nav.geospatial.map',
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
        {
          title: 'nav.datasets',
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
          title: 'nav.group.viz',
          icon: IconChartBar,

          items: [
            {
              title: 'nav.visualizations',
              url: '/apps/visualizations',
            },
            {
              title: 'nav.analytics.history',
              url: '/apps/analytics/history',
            },
          //   {
          //     title: '分析详情',
          //     url: '/apps/analytics/$id', // Changed from :id to $id
          //     hidden: true,
          //   }
          ]
        },
        // {
        //   title: '数据可视化',
        //   icon: IconChartPie,
        //   items: [
        //     {
        //       title: '可视化列表',
        //       url: '/apps/visualizations',
        //     },
        //     {
        //       title: '创建可视化',
        //       url: '/apps/visualizations/create',
        //     },
        //     {
        //       title: '可视化详情',
        //       url: '/apps/visualizations/$id/view', // Changed from :id to $id
        //       hidden: true,
        //     },
        //     {
        //       title: '编辑可视化',
        //       url: '/apps/visualizations/$id/edit', // Changed from :id to $id
        //       hidden: true,
        //     }
        //   ]
        // },
      ],
    },
    {
      title: 'nav.group.system',
      items: [
        {
          title: 'nav.system.settings',
          url: '/settings',
          icon: IconSettings,
          items: [
            {
              title: 'nav.profile',
              url: '/settings',
            },
            {
              title: 'nav.account',
              url: '/settings/account',
            },
            {
              title: 'nav.appearance',
              url: '/settings/appearance',
            },
            {
              title: 'nav.llm_settings',
              url: '/settings/llm',
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
