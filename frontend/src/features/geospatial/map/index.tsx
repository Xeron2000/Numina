import { useState } from 'react'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { MapView } from './components/map-view'
import { MapControls } from './components/map-controls'
import { MapLegend } from './components/map-legend'
import { MapFilters } from './components/map-filters'
import { ErrorBoundary } from '@/components/error-boundary'

export default function GeospatialMap() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <ErrorBoundary>
      <div className="container">  {/* 添加容器类 */}
        <Header>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">地图分析</h2>
              <p className="text-sm text-muted-foreground">
                空气质量数据的地理空间分析
              </p>
            </div>
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  筛选条件
                </Button>
              </SheetTrigger>
              <SheetContent>
                <MapFilters />
              </SheetContent>
            </Sheet>
          </div>
        </Header>

        <Main className="py-6">  {/* 添加内边距 */}
          <div className="grid gap-4 lg:grid-cols-4">
            <Card className="lg:col-span-3">
              <div className="aspect-[16/9]">
                <MapView />
              </div>
              <MapLegend className="p-4" />
            </Card>
            <Card className="p-4">
              <MapControls />
            </Card>
          </div>
        </Main>
      </div>
    </ErrorBoundary>
  )
}