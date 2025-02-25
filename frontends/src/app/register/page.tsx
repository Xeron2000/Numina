"use client"
import { useState } from "react"
import axios from "@/lib/axios"
import { useRouter } from "next/navigation"
import { Button } from "@/components/daisyui"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("/api/v1/auth/register", formData)
      if (response.status === 200) {
        router.push("/login")
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "注册失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-full bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">注册新账号</h2>
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
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
              <Button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "注册中..." : "立即注册"}
              </Button>
            </div>
          </form>

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