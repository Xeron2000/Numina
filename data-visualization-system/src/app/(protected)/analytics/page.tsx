// app/(protected)/analytics/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useData } from "@/hooks/use-data";
import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Download, 
  Calendar, 
  Users, 
  Activity,
  Database,
  FileText
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import MetricCard from "@/components/analytics/MetricCard";
import ChartActions from "@/components/analytics/ChartActions";
import { toast } from "sonner";

export default function AnalyticsPage() {
  const { fetchAnalyticsData, exportAnalyticsData } = useData();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAnalyticsData(timeRange);
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to load analytics data:", error);
        toast.error("Failed to load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchAnalyticsData, timeRange]);

  const handleExport = async () => {
    try {
      await exportAnalyticsData(timeRange);
      toast.success("Analytics data exported successfully");
    } catch (error) {
      console.error("Failed to export analytics data:", error);
      toast.error("Failed to export analytics data");
    }
  };

  const timeRangeLabel = useMemo(() => {
    const labels = {
      "7d": "Last 7 days",
      "30d": "Last 30 days",
      "90d": "Last 90 days",
      "1y": "Last year"
    };
    return labels[timeRange as keyof typeof labels];
  }, [timeRange]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            {timeRangeLabel} insights and statistics
          </p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleExport} disabled={loading}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={analyticsData?.usersMetric?.value || 0}
          change={analyticsData?.usersMetric?.change || 0}
          loading={loading}
          icon={<Users className="h-8 w-8 text-muted-foreground" />}
        />
        <MetricCard
          title="Active Datasets"
          value={analyticsData?.datasetsMetric?.value || 0}
          change={analyticsData?.datasetsMetric?.change || 0}
          loading={loading}
          icon={<Database className="h-8 w-8 text-muted-foreground" />}
        />
        <MetricCard
          title="Visualizations Created"
          value={analyticsData?.visualizationsMetric?.value || 0}
          change={analyticsData?.visualizationsMetric?.change || 0}
          loading={loading}
          icon={<PieChartIcon className="h-8 w-8 text-muted-foreground" />}
        />
        <MetricCard
          title="System Activity"
          value={analyticsData?.activityMetric?.value || 0}
          change={analyticsData?.activityMetric?.change || 0}
          loading={loading}
          icon={<Activity className="h-8 w-8 text-muted-foreground" />}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">System Usage</TabsTrigger>
          <TabsTrigger value="data">Data Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Active users over time</CardDescription>
                </div>
                <ChartActions />
              </CardHeader>
              <CardContent className="pt-2">
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <div className="h-80">
                    <LineChart 
                      data={analyticsData?.userActivityChart?.data || []} 
                      xKey="date" 
                      yKey="users" 
                      name="Users" 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle>Data Processed</CardTitle>
                  <CardDescription>Volume of data processed over time</CardDescription>
                </div>
                <ChartActions />
              </CardHeader>
              <CardContent className="pt-2">
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <div className="h-80">
                    <BarChart 
                      data={analyticsData?.dataProcessedChart?.data || []}
                      xKey="date"
                      yKey="value"
                      name="Data"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>CPU and memory usage</CardDescription>
                </div>
                <ChartActions />
              </CardHeader>
              <CardContent className="pt-2">
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <div className="h-80">
                    <LineChart 
                      data={analyticsData?.systemPerformanceChart?.data || []} 
                      xKey="date" 
                      yKey="value" 
                      name="Usage %" 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle>User Sessions</CardTitle>
                  <CardDescription>Active sessions by time of day</CardDescription>
                </div>
                <ChartActions />
              </CardHeader>
              <CardContent className="pt-2">
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <div className="h-80">
                    <BarChart 
                      data={analyticsData?.userSessionsChart?.data || []}
                      xKey="hour"
                      yKey="sessions"
                      name="Sessions"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle>Dataset Distribution</CardTitle>
                  <CardDescription>Types of datasets in use</CardDescription>
                </div>
                <ChartActions />
              </CardHeader>
              <CardContent className="pt-2">
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <div className="h-80">
                    <PieChart 
                      data={analyticsData?.datasetDistributionChart?.data || []}
                      nameKey="type"
                      valueKey="count"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle>Visualization Types</CardTitle>
                  <CardDescription>Most popular visualization types</CardDescription>
                </div>
                <ChartActions />
              </CardHeader>
              <CardContent className="pt-2">
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <div className="h-80">
                    <BarChart 
                      data={analyticsData?.visualizationTypesChart?.data || []}
                      xKey="type"
                      yKey="count"
                      name="Count"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}