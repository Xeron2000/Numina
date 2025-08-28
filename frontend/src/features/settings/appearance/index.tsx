import ContentSection from '../components/content-section'
import { AppearanceForm } from './appearance-form'
import { useTranslation } from 'react-i18next'

export default function SettingsAppearance() {
  const { t } = useTranslation()
  return (
    <ContentSection
      title={t('settings.appearance.title')}
      desc={t('settings.appearance.desc')}
    >
      <AppearanceForm />
    </ContentSection>
  )
}
