import { createLazyFileRoute } from '@tanstack/react-router'
import Visualizations from '@/features/visualizations'

export const Route = createLazyFileRoute('/_authenticated/apps/visualizations/')({
  component: Visualizations,
})