import { useState } from 'react'
import { Plus } from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { MapView } from './components/map-view'
import { FencesList } from './components/fences-list'
import { CreateFenceDialog } from './components/create-fence-dialog'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || ''

export default function GeospatialFences() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <>
      <Header>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">地理围栏</h2>
            <p className="text-sm text-muted-foreground">
              管理和监控地理围栏区域
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            创建围栏
          </Button>
        </div>
      </Header>

      <Main className="py-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <Card className="lg:col-span-3">
            <div className="aspect-[16/9]">
              <MapView />
            </div>
          </Card>
          <Card className="p-4">
            <FencesList />
          </Card>
        </div>
      </Main>

      <CreateFenceDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </>
  )
}