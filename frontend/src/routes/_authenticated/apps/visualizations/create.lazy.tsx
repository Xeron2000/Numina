import { createLazyFileRoute } from '@tanstack/react-router'
import VisualizationCreate from '@/features/visualizations/create'

export const Route = createLazyFileRoute('/_authenticated/apps/visualizations/create')({
  component: VisualizationCreate,
})