// hooks/use-auth.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // 在实际应用中，这里应该从API或本地存储中获取用户信息
    const checkAuth = async () => {
      try {
        // 在开发环境中，可以设置一个模拟的用户
        if (process.env.NODE_ENV === "development") {
          // 通过localStorage来控制开发环境是否需要认证
          const devBypassAuth = localStorage.getItem("devBypassAuth");
          
          if (devBypassAuth === "true") {
            setUser({
              id: "dev-user",
              name: "开发者",
              email: "dev@example.com",
              role: "admin",
              avatar: "/placeholder-avatar.jpg"
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
          const response = await fetch("/api/auth/me");
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
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // 在开发环境中，模拟登录过程
      if (process.env.NODE_ENV === "development") {
        // 简单的模拟登录逻辑
        if (email && password) {
          const mockUser = {
            id: "user-1",
            name: email.split("@")[0],
            email,
            role: email.includes("admin") ? "admin" : "user",
            avatar: "/placeholder-avatar.jpg"
          };
          
          setUser(mockUser);
          localStorage.setItem("user", JSON.stringify(mockUser));
          router.push("/dashboard");
          return { success: true };
        }
        return { success: false, error: "无效的凭证" };
      } else {
        // 生产环境: 调用API
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/dashboard");
          return { success: true };
        }
        
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("登录失败:", error);
      return { success: false, error: "登录过程中出错" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (process.env.NODE_ENV === "development") {
        // 开发环境：简单清除本地存储
        localStorage.removeItem("user");
      } else {
        // 生产环境：调用登出API
        await fetch("/api/auth/logout", { method: "POST" });
        localStorage.removeItem("user");
      }
      
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("登出失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 开发环境：切换开发者模式认证绕过
  const toggleDevAuth = (enabled: boolean) => {
    if (process.env.NODE_ENV === "development") {
      localStorage.setItem("devBypassAuth", enabled ? "true" : "false");
      window.location.reload(); // 重新加载以应用更改
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    toggleDevAuth,
    isDev: process.env.NODE_ENV === "development"
  };
}