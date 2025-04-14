import { createLazyFileRoute } from '@tanstack/react-router'
import GeospatialFences from '@/features/geospatial/fences'

export const Route = createLazyFileRoute('/_authenticated/apps/geospatial/fences')({
  component: GeospatialFences,
})