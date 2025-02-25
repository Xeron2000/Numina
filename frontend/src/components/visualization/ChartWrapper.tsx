import { ReactNode, useEffect, useState } from 'react'
import axios from '@/lib/axios'
import Select from '../daisyui/Select'
import { LineChart, BarChart, PieChart } from './ChartTypes'
import React from 'react'

interface ChartWrapperProps {
  title: string
  datasetId: string
  initialType?: 'line' | 'bar' | 'pie'
}

interface ChartData {
  // 根据实际数据结构定义
  [key: string]: any
}

export default function ChartWrapper({
  title,
  datasetId,
  initialType = 'line'
}: ChartWrapperProps) {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>(initialType)
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get<ChartData[]>(`/api/v1/analysis/data`, {
          params: { datasetId }
        })
        // 添加数据验证
        if (Array.isArray(response.data)) {
          setData(response.data)
        } else {
          throw new Error('Invalid data format')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chart data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [datasetId])

  const renderChart = () => {
    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-500">{error}</div>

    switch (chartType) {
      case 'line':
        return <LineChart data={data} />
      case 'bar':
        return <BarChart data={data} />
      case 'pie':
        return <PieChart data={data} />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'pie')}
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </Select>
      </div>
      <div className="w-full h-[400px]">
        {renderChart()}
      </div>
    </div>
  )
}