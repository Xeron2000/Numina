import { createLazyFileRoute } from '@tanstack/react-router'
import AnalyticsDetail from '@/features/analytics/detail'

export const Route = createLazyFileRoute('/_authenticated/apps/analytics/$id')({
  component: AnalyticsDetail,
})