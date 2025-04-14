import { createLazyFileRoute } from '@tanstack/react-router'
import Datasets from '@/features/datasets'

export const Route = createLazyFileRoute('/_authenticated/apps/datasets/')({
  component: Datasets,
})