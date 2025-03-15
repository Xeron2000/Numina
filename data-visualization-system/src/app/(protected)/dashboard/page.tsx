// app/(protected)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/hooks/use-data";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { permissions, parse } from "@/lib/utils"
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { fetchDashboardStats } = useData();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const controller = new AbortController(); // 创建 AbortController
    const signal = controller.signal; // 获取 signal

    const loadData = async () => {
      try {
        setLoading(true);
        // await new Promise(resolve => setTimeout(resolve, 6000));
        const data = await fetchDashboardStats(signal);
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (permissions()) {
      loadData();
    } else {
      router.push('/login')
    }

    return () => {
      controller.abort(); // 组件卸载时取消请求
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Numina, your data visualization system.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total Datasets"
          value={stats?.datasets || 0}
          description="Datasets uploaded"
          loading={loading}
          icon={<BarChart className="h-8 w-8 text-muted-foreground" />}
        />
        <DashboardCard
          title="Visualizations"
          value={stats?.visualizations || 0}
          description="Created visualizations"
          loading={loading}
          icon={<PieChart className="h-8 w-8 text-muted-foreground" />}
        />
        <DashboardCard
          title="Analysis Reports"
          value={stats?.analytics || 0}
          description="Generated reports"
          loading={loading}
          icon={<BarChart className="h-8 w-8 text-muted-foreground" />}
        />
      </div>

      <Tabs defaultValue="datasets" className="w-full">
        <TabsList>
          <TabsTrigger value="datasets">Recent Datasets</TabsTrigger>
          <TabsTrigger value="visualizations">Recent Visualizations</TabsTrigger>
          <TabsTrigger value="analytics">Recent Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="datasets" className="space-y-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              stats?.allsets?.datasets.map((item: any, index: number) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md p-4 bg-gray-50 dark:bg-gray-800 mb-4">
                      <p className="text-xl font-semibold mb-3">Basic information:</p>
                      <p className="text-sm py-1 flex justify-between">
                        <span className="font-medium">File Name:</span>
                        <span>{parse(item.file_path) || 'null'}</span>
                      </p>
                      <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">File Type:</span>
                        <span>{item.file_type.toUpperCase() || 'null'}</span>
                      </p>
                      <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Row Count:</span>
                        <span>{item.row_count || 'null'}</span>
                      </p>
                      <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Create Time:</span>
                        <span>{item.created_at || 'null'}</span>
                      </p>
                      <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Updated Time:</span>
                        <span>{item.updated_at || 'null'}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-muted-foreground">No recent activity found.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="visualizations" className="space-y-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              stats?.allsets?.visualizations.map((item: any, index: number) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md p-4 bg-gray-50 dark:bg-gray-800 mb-4">
                      <p className="text-xl font-semibold mb-3">Basic information:</p>
                      <p className="text-sm py-1 flex justify-between">
                        <span className="font-medium">Chart Type:</span>
                        <span>{item.visualization_type || 'null'}</span>
                      </p>
                      {/* <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">File Type:</span>
                        <span>{item.file_type.toUpperCase() || 'null'}</span>
                      </p>
                      <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Row Count:</span>
                        <span>{item.row_count || 'null'}</span>
                      </p> */}
                      <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Create Time:</span>
                        <span>{item.created_at || 'null'}</span>
                      </p>
                      <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Updated Time:</span>
                        <span>{item.updated_at || 'null'}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-muted-foreground">No recent activity found.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              stats?.allsets?.analytics.map((item: any, index: number) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md p-4 bg-gray-50 dark:bg-gray-800 mb-4">
                      <p className="text-xl font-semibold mb-3">Basic information:</p>
                      {/* <p className="text-sm py-1 flex justify-between">
                        <span className="font-medium">File Name:</span>
                        <span>{parse(item.file_path) || 'null'}</span>
                      </p>
                      <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">File Type:</span>
                        <span>{item.file_type.toUpperCase() || 'null'}</span>
                      </p>
                      <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Row Count:</span>
                        <span>{item.row_count || 'null'}</span>
                      </p> */}
                      <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Create Time:</span>
                        <span>{item.created_at || 'null'}</span>
                      </p>
                      <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                        <span className="font-medium">Updated Time:</span>
                        <span>{item.updated_at || 'null'}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-muted-foreground">No recent activity found.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: number | string;
  description: string;
  loading: boolean;
  icon: React.ReactNode;
}

function DashboardCard({ title, value, description, loading, icon }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground pt-1">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}