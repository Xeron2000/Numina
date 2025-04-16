import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { datasetsApi } from '@/api/datasets'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Link } from '@tanstack/react-router'

export default function DatasetDetail() {
  const { id } = useParams({ from: '/_authenticated/apps/datasets/$id' })
  const { data: dataset, isLoading } = useQuery({
    queryKey: ['datasets', id],
    queryFn: () => datasetsApi.getById(Number(id))
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!dataset) {
    return <div>Dataset not found</div>
  }

  return (
    <>
      <Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/apps/datasets">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-lg font-semibold">{dataset.data.name}</h2>
              <p className="text-sm text-muted-foreground">
                {dataset.data.description}
              </p>
            </div>
          </div>
        </div>
      </Header>

      <Main className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>数据集信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium">文件类型</div>
                  <div className="text-sm text-muted-foreground">
                    {dataset.data.file_type}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">创建时间</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(dataset.data.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>数据预览</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Add data preview component */}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}