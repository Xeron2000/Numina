"use client"
import React from 'react';
import { POST, AuthResponse } from '../api/auth/route'
import { useRouter } from "next/navigation"
import { useState } from "react"
import Swal from 'sweetalert2';

export default function LoginPage() {

  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!formData.email) {
      Swal.fire({
        icon: 'warning',
        title: '邮箱未填写',
      })

      setLoading(false)

    } else if (!formData.password) {
      Swal.fire({
        icon: 'warning',
        title: '密码未填写',
      })

      setLoading(false)

    } else {
      try {
        const response = await POST(formData);
        const data = await response.json();
        
        if (response.status === 200) {
          router.push("/dashboard/overview");
        } else if (response.status === 401) {
          Swal.fire({
            icon: 'warning',
            title: data.message,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: data.message,
          });
        }

      } catch (err: any) {
        console.log("err", err)

        Swal.fire({
          icon: 'error',
          title: '系统错误',
        });
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="h-full flex items-center justify-center bg-base-100">
      <div className="card bg-base-200 shadow-xl w-full max-w-md">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">登录</h1>
          <form className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">邮箱</span>
              </label>
              <input
                type="email"
                placeholder="请输入邮箱"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">密码</span>
              </label>
              <input
                type="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control mt-10">
              <button onClick={handleLogin} className="btn btn-primary w-full mt-5">
                {loading ? "登录中..." : "登录"}
              </button>
            </div>
          </form>
          <div className="divider">或</div>
          <button className="btn btn-outline w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            使用 Google 登录
          </button>
          <div className="text-center mt-4">
            没有账号？{" "}
            <a href="/register" className="link link-primary">
              立即注册
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}