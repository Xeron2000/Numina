import { createLazyFileRoute } from '@tanstack/react-router'
import AnalyticsBuilder from '@/features/analytics/builder'

export const Route = createLazyFileRoute('/_authenticated/apps/analytics/builder')({
  component: AnalyticsBuilder,
})