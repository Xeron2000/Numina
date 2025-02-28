import { NextResponse } from 'next/server'
import axios from '@/lib/axios'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const datasetId = searchParams.get('datasetId')
  
  try {
    const response = await axios.get(`/analysis/${datasetId}`)
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analysis data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const analysisRequest = await request.json()
    
    // 根据请求类型调用不同的分析接口
    let response
    switch (analysisRequest.type) {
      case 'trend':
        response = await axios.post('/analysis/analyze', analysisRequest)
        break
      case 'clean':
        response = await axios.post('/analysis/clean', analysisRequest)
        break
      case 'transform':
        response = await axios.post('/analysis/transform', analysisRequest)
        break
      case 'train':
        response = await axios.post('/analysis/train', analysisRequest)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        )
    }
    
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Analysis request failed' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const fileData = await request.formData()
    
    // 上传文件
    const response = await axios.post('/analysis/upload', fileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    )
  }
}