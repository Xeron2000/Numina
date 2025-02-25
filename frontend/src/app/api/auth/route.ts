import { NextResponse } from 'next/server'
import axios from '@/lib/axios'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  try {
    const response = await axios.post('/auth/login', {
      email,
      password
    })
    
    return NextResponse.json({
      success: true,
      data: response.data
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.response?.data?.message || '登录失败'
    }, {
      status: error.response?.status || 500
    })
  }
}