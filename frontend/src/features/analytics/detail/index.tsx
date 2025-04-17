import { useParams } from '@tanstack/react-router'

export default function AnalyticsDetail() {
  const { id } = useParams({ from: '/_authenticated/apps/analytics/$id' })
  
  return (
    <div>
      <h1>Analytics Detail</h1>
      <p>Analytics ID: {id}</p>
    </div>
  )
}