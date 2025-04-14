import { createLazyFileRoute } from '@tanstack/react-router'
import DatasetUpload from '@/features/datasets/upload'

export const Route = createLazyFileRoute('/_authenticated/apps/datasets/upload')({
  component: DatasetUpload,
})