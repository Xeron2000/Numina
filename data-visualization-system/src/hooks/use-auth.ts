// hooks/use-auth.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface User {
  email: string;
  username: string;
  id: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // useEffect(() => {
  // 在实际应用中，这里应该从API或本地存储中获取用户信息
  const checkAuth = async () => {
    try {
      // 在开发环境中，可以设置一个模拟的用户
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        // 通过localStorage来控制开发环境是否需要认证
        const devBypassAuth = localStorage.getItem("devBypassAuth");

        if (devBypassAuth === "true") {
          setUser({
            id: 0,
            username: "开发者",
            email: "dev@example.com",
            is_active: true,
            created_at: "/placeholder-avatar.jpg"
          });
        } else {
          // 从localStorage获取用户信息（如果有）
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setUser(null);
          }
        }
      } else {
        // 生产环境：从API获取用户信息
        // 示例：调用API端点
        const response = await fetch("http://127.0.0.1:8000/api/auth/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            }
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));

        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("认证检查失败:", error);
      setUser(null);
    }
    // finally {
    //   setIsLoading(false);
    // }
  };

  //   checkAuth();
  // }, []);

  const login = async (email: string, password: string) => {
    try {
      // 在开发环境中，模拟登录过程
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        // 简单的模拟登录逻辑
        if (email && password) {
          const mockUser = {
            id: 0,
            username: "开发者",
            email: "dev@example.com",
            is_active: true,
            created_at: "/placeholder-avatar.jpg"
          };

          setUser(mockUser);
          localStorage.setItem("user", JSON.stringify(mockUser));
          router.push("/dashboard");
          return { success: true };
        }
        return { success: false, error: "无效的凭证" };
      } else {
        // 生产环境: 调用API
        const params = new URLSearchParams();
        params.append('username', email); // 字段名必须与后端一致（此处为 username）
        params.append('password', password)

        const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('auth_token', data.access_token)
          await checkAuth()
          router.push("/dashboard");
          return { success: true };
        }

        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("登录失败:", error);
      return { success: false, error: "登录过程中出错" };
    } 
  };

  const logout = async () => {
    try {
      if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
        // 开发环境：简单清除本地存储
        setUser(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        router.push("/login");
      } else {
        // 生产环境：调用登出API
        const response = await fetch("http://127.0.0.1:8000/api/auth/logout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            }
          }
        );

        if (response.ok) {
          setUser(null);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          router.push("/login");
        } else {
          alert("登出失败,请重试");
        }

      }
    } catch (error) {
      console.error("登出失败:", error);
    } 
  };

  // 开发环境：切换开发者模式认证绕过
  const toggleDevAuth = (enabled: boolean) => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
      localStorage.setItem("devBypassAuth", enabled ? "true" : "false");
      window.location.reload(); // 重新加载以应用更改
    }
  };

  return {
    user,
    login,
    logout,
    toggleDevAuth,
    isDev: process.env.NEXT_PUBLIC_NODE_ENV === "development"
  };
}