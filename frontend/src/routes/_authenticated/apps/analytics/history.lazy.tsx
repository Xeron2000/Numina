import { createLazyFileRoute } from '@tanstack/react-router'
import AnalyticsHistory from '@/features/analytics/history'

export const Route = createLazyFileRoute('/_authenticated/apps/analytics/history')({
  component: AnalyticsHistory,
})