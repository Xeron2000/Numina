import { createLazyFileRoute } from '@tanstack/react-router'
import VisualizationView from '@/features/visualizations/view'

export const Route = createLazyFileRoute('/_authenticated/apps/visualizations/$id/view')({
  component: VisualizationView,
})