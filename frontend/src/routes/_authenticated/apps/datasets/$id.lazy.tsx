import { createLazyFileRoute } from '@tanstack/react-router'
import DatasetDetail from '@/features/datasets/detail'

export const Route = createLazyFileRoute('/_authenticated/apps/datasets/$id')({
  component: DatasetDetail,
})