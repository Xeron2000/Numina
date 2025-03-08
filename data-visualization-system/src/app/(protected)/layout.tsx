// app/(protected)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SideNavigation } from "@/components/layout/SideNavigation";
import { TopBar } from "@/components/layout/TopBar";
import { useAuth } from "@/hooks/use-auth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // 检查是否为开发环境
    setIsDev(process.env.NODE_ENV === "development");
    
    // 在生产环境中强制认证，开发环境可选
    if (!isLoading && !user && !isDev) {
      router.push("/login");
    }
  }, [user, isLoading, router, isDev]);

  // 加载状态处理
  if (isLoading && !isDev) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <SideNavigation className="border-r" />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}