import { createLazyFileRoute } from '@tanstack/react-router'
import GeospatialMap from '@/features/geospatial/map'

export const Route = createLazyFileRoute('/_authenticated/apps/geospatial/')({
  component: GeospatialMap,
})