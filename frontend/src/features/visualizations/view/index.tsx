import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { visualizationsApi } from '@/api/visualizations'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

export default function VisualizationView() {
  const { id } = useParams({ from: '/_authenticated/apps/visualizations/$id/view' })
  const { data, isLoading } = useQuery({
    queryKey: ['visualization', id],
    queryFn: () => visualizationsApi.getById(Number(id))
  })

  if (isLoading) {
    return <div>加载中...</div>
  }

  return (
    <>
      <Header>
        <div>
          <h2 className="text-lg font-semibold">{data?.data.name}</h2>
          <p className="text-sm text-muted-foreground">
            {data?.data.description}
          </p>
        </div>
      </Header>

      <Main>
        <Card className="p-6">
          {/* TODO: Implement visualization rendering based on type and config */}
          <div className="aspect-video rounded-md border bg-muted/50" />
        </Card>
      </Main>
    </>
  )
}