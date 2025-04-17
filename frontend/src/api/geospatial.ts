import { http } from '@/lib/http'

export interface GeoFence {
  id: number
  name: string
  description?: string
  coordinates: any // GeoJSON格式
  center: {
    lat: number
    lng: number
  }
  radius?: number
  fence_type: 'polygon' | 'circle'
  owner_id: number
  created_at: string
  updated_at: string
}

export interface MapData {
  points: Array<{
    lat: number
    lng: number
    value: number
  }>
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

export const geospatialApi = {
  getFences: () => 
    http.get<GeoFence[]>('/api/v1/geospatial/fences'),
  
  createFence: (data: Omit<GeoFence, 'id' | 'owner_id' | 'created_at' | 'updated_at'>) =>
    http.post<GeoFence>('/api/v1/geospatial/fences', data),

  getMapData: () =>
    http.get<MapData>('/api/v1/geospatial/map'),

  getHeatmapData: () =>
    http.get<MapData>('/api/v1/geospatial/heatmap'),
}