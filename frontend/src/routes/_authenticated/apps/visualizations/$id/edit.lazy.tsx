import { createLazyFileRoute } from '@tanstack/react-router'
import VisualizationEdit from '@/features/visualizations/edit'

export const Route = createLazyFileRoute('/_authenticated/apps/visualizations/$id/edit')({
  component: VisualizationEdit,
})
