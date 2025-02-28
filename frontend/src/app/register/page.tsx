"use client"
import { useState } from "react"
import axios from "@/lib/axios"
import { useRouter } from "next/navigation"
import { Button } from "@/components/daisyui"
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post("/register", formData)
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: '注册成功',
          text: `欢迎 ${formData.username}，请登录`
        })
        router.push("/login")
      } else {
        Swal.fire({
          icon: 'warning',
          title: response.data,
        })
      }
    } catch (err: any) {
      console.log("err", err)
      Swal.fire({
        icon: 'error',
        title: '注册失败',
      })

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-full bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">注册</h1>
          <div className="form-control">
            <label className="label">
              <span className="label-text">用户名</span>
            </label>
            <input
              type="text"
              placeholder="请输入用户名"
              value={formData.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="input input-bordered w-full"
              required
            />
          </div>

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

          <div className="form-control mt-6">
            <Button onClick={handleSubmit} className="btn-primary" disabled={loading}>
              {loading ? "注册中..." : "立即注册"}
            </Button>
          </div>
          <div className="text-center mt-4">
            已有账号？{" "}
            <a href="/login" className="link link-primary">
              立即登录
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}