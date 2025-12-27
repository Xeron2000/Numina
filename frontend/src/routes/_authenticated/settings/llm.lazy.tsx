import { createLazyFileRoute } from '@tanstack/react-router'
import LLMSettings from '@/features/settings/llm'

export const Route = createLazyFileRoute('/_authenticated/settings/llm')({
  component: LLMSettings,
})
