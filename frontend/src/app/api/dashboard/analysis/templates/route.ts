import { NextResponse } from 'next/server'
import axios from '@/lib/axios'

export async function GET() {
  try {
    const response = await axios.get('/api/v1/analysis/templates')
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analysis templates' },
      { status: 500 }
    )
  }
}