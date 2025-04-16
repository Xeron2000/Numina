import ContentSection from '../components/content-section'
import { NotificationsForm } from './notifications-form'

export default function SettingsNotifications() {
  return (
    <ContentSection
      title='通知设置'
      desc='配置您接收通知的方式。'
    >
      <NotificationsForm />
    </ContentSection>
  )
}
