'use client'

import { useState, FormEvent } from 'react'
import { useTheme } from '@/components/ThemeContext'
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Select,
  Toggle,
  Button,
} from '@/components/daisyui'
import { toast } from 'react-hot-toast'

interface SettingsFormProps {
  initialSettings?: {
    theme: string
    language: string
    notificationsEnabled: boolean
  }
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState(initialSettings?.language || 'zh')
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    initialSettings?.notificationsEnabled || true
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/dashboard/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          language,
          notificationsEnabled,
        }),
      })

      if (!response.ok) {
        throw new Error('保存设置失败')
      }

      toast.success('设置已保存')
    } catch (error) {
      toast.error('保存设置时出错')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardBody>
        <Tabs variant="boxed" className="mb-4">
          <Tab active>
            常规设置
          </Tab>
          <Tab>数据源管理</Tab>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">主题</span>
            </label>
            <Select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              className="w-full max-w-xs"
              required
            >
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="system">系统默认</option>
            </Select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">语言</span>
            </label>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full max-w-xs"
              required
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
            </Select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">通知</span>
            </label>
            <Toggle
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '保存设置'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}