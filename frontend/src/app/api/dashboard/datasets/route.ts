import { NextResponse } from 'next/server'

export async function GET() {
  // 这里添加获取数据集列表的逻辑
  const datasets = [
    { id: 1, name: 'Sales Data', size: '1.2GB' },
    { id: 2, name: 'User Analytics', size: '850MB' }
  ]
  
  return NextResponse.json(datasets)
}

export async function POST(request: Request) {
  const { name, size } = await request.json()
  
  // 这里添加创建新数据集的逻辑
  
  return NextResponse.json({ 
    success: true,
    message: 'Dataset created successfully'
  })
}