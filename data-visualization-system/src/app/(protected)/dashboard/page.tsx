// app/(protected)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/hooks/use-data";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, LineChart, PieChart } from "lucide-react";

export default function DashboardPage() {
  const { fetchDashboardStats } = useData();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchDashboardStats]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Numina, your data visualization system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="Total Datasets" 
          value={stats?.datasetsCount || 0} 
          description="Datasets uploaded"
          loading={loading}
          icon={<BarChart className="h-8 w-8 text-muted-foreground" />}
        />
        <DashboardCard 
          title="Visualizations" 
          value={stats?.visualizationsCount || 0} 
          description="Created visualizations"
          loading={loading}
          icon={<PieChart className="h-8 w-8 text-muted-foreground" />}
        />
        <DashboardCard 
          title="Data Points" 
          value={stats?.dataPointsCount?.toLocaleString() || 0} 
          description="Total data points"
          loading={loading}
          icon={<LineChart className="h-8 w-8 text-muted-foreground" />}
        />
        <DashboardCard 
          title="Analysis Reports" 
          value={stats?.reportsCount || 0} 
          description="Generated reports"
          loading={loading}
          icon={<BarChart className="h-8 w-8 text-muted-foreground" />}
        />
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="popular">Popular Visualizations</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
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
              stats?.recentActivity?.map((item: any, index: number) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.type} • {item.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                      {item.type === 'dataset' ? <BarChart className="h-12 w-12" /> : 
                       item.type === 'visualization' ? <PieChart className="h-12 w-12" /> : 
                       <LineChart className="h-12 w-12" />}
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-muted-foreground">No recent activity found.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="popular" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
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
              stats?.popularVisualizations?.map((item: any, index: number) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.views} views • {item.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                      {item.type === 'bar' ? <BarChart className="h-12 w-12" /> : 
                       item.type === 'pie' ? <PieChart className="h-12 w-12" /> : 
                       <LineChart className="h-12 w-12" />}
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-muted-foreground">No popular visualizations found.</p>
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