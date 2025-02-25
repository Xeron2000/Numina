import { NextResponse } from 'next/server'

export async function GET() {
  // 这里添加获取总览数据的逻辑
  const overviewData = {
    totalUsers: 1000,
    activeUsers: 750,
    datasetsCount: 50
  }
  
  return NextResponse.json(overviewData)
}