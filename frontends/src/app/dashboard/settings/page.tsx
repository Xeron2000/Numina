import { Metadata } from 'next'
import SettingsForm from '@/components/settings/SettingsForm'

export const metadata: Metadata = {
  title: 'Settings - Numina Analytics',
}

export default function SettingsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">系统设置</h1>
      <SettingsForm />
    </div>
  )
}