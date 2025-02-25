import { Line } from 'react-chartjs-2'
import { Bar } from 'react-chartjs-2'
import { Pie } from 'react-chartjs-2'

interface ChartProps {
  data: any[]
}

export function LineChart({ data }: ChartProps) {
  return (
    <Line
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: 'Value',
            data: data.map((d) => d.value),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      }}
    />
  )
}

export function BarChart({ data }: ChartProps) {
  return (
    <Bar
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: 'Value',
            data: data.map((d) => d.value),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      }}
    />
  )
}

export function PieChart({ data }: ChartProps) {
  return (
    <Pie
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: 'Value',
            data: data.map((d) => d.value),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }
        ]
      }}
    />
  )
}