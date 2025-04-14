import { createLazyFileRoute } from '@tanstack/react-router'
import GeospatialHeatmap from '@/features/geospatial/heatmap'

export const Route = createLazyFileRoute('/_authenticated/apps/geospatial/heatmap')({
  component: GeospatialHeatmap,
})
