"use client"
import { useState } from "react"
import axios from "@/lib/axios"
import { useRouter } from "next/navigation"
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
    <div className="flex justify-center items-center h-screen bg-base-200">
      <div className="google-card w-full max-w-md">
        <div className="card-body space-y-4">
          <h1 className="text-3xl font-bold text-center text-base-content">注册</h1>

          <div className="form-control">
            <label className="label">
              <span className="label-text viz-text">邮箱</span>
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
              <span className="label-text viz-text">密码</span>
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
            <button onClick={handleSubmit} className="btn-google bg-primary text-white w-full" disabled={loading}>
              {loading ? "注册中..." : "立即注册"}
            </button>
          </div>
          <div className="text-center mt-4 viz-text">
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