import { useParams } from '@tanstack/react-router'
import { IconDownload, IconRefresh } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

export default function DatasetDetail() {
  const { id } = useParams({ from: '/_authenticated/apps/datasets/$id' })

  // 临时数据，后续需要替换为API调用
  const dataset = {
    id: Number(id),
    name: '空气质量数据集2023',
    description: '包含2023年全年的空气质量监测数据',
    created_at: '2024-01-15',
    file_type: 'CSV',
    columns: ['日期', 'PM2.5', 'PM10', 'SO2', 'NO2', 'O3', 'CO'],
    preview: [
      ['2023-01-01', '35', '56', '8', '45', '23', '0.8'],
      ['2023-01-02', '42', '68', '10', '52', '31', '1.2'],
    ]
  }

  return (
    <>
      <Header>
        <h2 className="text-lg font-semibold">{dataset.name}</h2>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <IconDownload size={16} className="mr-2" />
            下载
          </Button>
          <Button variant="outline" size="sm">
            <IconRefresh size={16} className="mr-2" />
            刷新
          </Button>
        </div>
      </Header>

      <Main>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="preview">数据预览</TabsTrigger>
            <TabsTrigger value="analysis">分析</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">基本信息</h3>
                <div className="mt-4 grid gap-4 rounded-lg border p-4">
                  <div>
                    <span className="text-sm text-muted-foreground">描述：</span>
                    <p>{dataset.description}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">创建时间：</span>
                    <span>{dataset.created_at}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">文件类型：</span>
                    <span>{dataset.file_type}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">数据结构</h3>
                <div className="mt-4 rounded-lg border p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {dataset.columns.map((column) => (
                      <div
                        key={column}
                        className="rounded-md border p-2 text-sm"
                      >
                        {column}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {dataset.columns.map((column) => (
                      <th key={column} className="p-2 text-left text-sm">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataset.preview.map((row, index) => (
                    <tr key={index} className="border-b">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-2 text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <div className="rounded-lg border p-4">
              <p className="text-center text-muted-foreground">
                数据分析功能开发中...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}