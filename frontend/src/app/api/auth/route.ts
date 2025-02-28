import { NextResponse } from 'next/server'
import axios from '@/lib/axios'

interface FormData {
  email: string;
  password: string;
}

interface token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// 定义响应体接口
export interface AuthResponse {
  status: number;
  message: string | token;
}

export async function POST(formData: FormData) {

  try {
    const params = new URLSearchParams();
    // 但是OAuth2PasswordRequestForm只有username,password(@/backend/app/api/v1/endpoints/auth.py )
    // 所以username 实际上是 email
    params.append('username', formData.email);
    params.append('password', formData.password);

    const response = await axios.post('/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }) as AuthResponse;

    if (response.status === 200) {
      return NextResponse.json(response.message); // 默认状态码 200
    }else if (response.status === 401) {
      return NextResponse.json(
        { message: response.message },
        { status: 401 }
      );
    }else{
      return NextResponse.json(
          { error: response.message },
          { status: 500 }
        );
    }
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      { error: '系统错误' },
      { status: 500 }
    );
  }
}
