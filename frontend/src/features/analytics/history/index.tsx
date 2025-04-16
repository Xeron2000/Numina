import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AnalyticsHistory() {
  const mockHistory = [
    {
      id: 1,
      query: 'SELECT * FROM air_quality WHERE city = "北京"',
      timestamp: '2024-01-20 14:30:00',
      status: '已完成',
    },
    {
      id: 2,
      query: 'SELECT AVG(pm25) FROM air_quality GROUP BY date',
      timestamp: '2024-01-19 16:45:00',
      status: '已完成',
    },
    // 可以添加更多模拟数据
  ]

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>查询历史</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>查询语句</TableHead>
                  <TableHead>执行时间</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-mono">{item.query}</TableCell>
                    <TableCell>{item.timestamp}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}