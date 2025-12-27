import { Outlet } from '@tanstack/react-router'
import {
  // IconBrowserCheck,
  // IconNotification,
  IconPalette,
  IconTool,
  IconUser,
  IconBrain,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import SidebarNav from './components/sidebar-nav'
import { useTranslation } from 'react-i18next'

export default function Settings() {
  const { t } = useTranslation()
  return (
    <>
      <Header>
        <div className='ml-auto flex items-center space-x-4'>
        </div>
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('settings.title')}
          </h1>
          <p className='text-muted-foreground'>
            {t('settings.subtitle')}
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems(t)} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1 pr-4'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = (t: (key: string) => string) => [
  {
    title: t('settings.sidebar.profile'),
    icon: <IconUser size={18} />,
    href: '/settings',
  },
  {
    title: t('settings.sidebar.account'),
    icon: <IconTool size={18} />,
    href: '/settings/account',
  },
  {
    title: t('settings.sidebar.appearance'),
    icon: <IconPalette size={18} />,
    href: '/settings/appearance',
  },
  {
    title: t('settings.sidebar.llm'),
    icon: <IconBrain size={18} />,
    href: '/settings/llm',
  },
  // {
  //   title: t('settings.sidebar.notifications'),
  //   icon: <IconNotification size={18} />,
  //   href: '/settings/notifications',
  // },
  // {
  //   title: t('settings.sidebar.display'),
  //   icon: <IconBrowserCheck size={18} />,
  //   href: '/settings/display',
  // },
]
