import { createFileRoute } from '@tanstack/react-router'
import Visualizations from '@/features/visualizations'

export const Route = createFileRoute('/_authenticated/apps/visualizations/')({
  component: Visualizations,
})