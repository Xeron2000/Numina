// app/(protected)/visualizations/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/hooks/use-data";
import { BarChart, LineChart, PieChart, Search, Plus, Share2, MoreHorizontal, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/use-debounce";
import { Visualization } from "@/lib/types";

export default function VisualizationsPage() {
  const { fetchVisualizations, fetchDatasets } = useData();
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchVisualizations({ query: debouncedSearch });
        setVisualizations(data);

        const datasetsData = await fetchDatasets({});
        setDatasets(datasetsData);
      } catch (error) {
        console.error("Failed to load visualizations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchVisualizations, fetchDatasets, debouncedSearch]);

  const getChartIcon = (type: string) => {
    switch (type) {
      case "bar":
        return <BarChart className="h-12 w-12" />;
      case "pie":
        return <PieChart className="h-12 w-12" />;
      default:
        return <LineChart className="h-12 w-12" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Visualizations</h1>
          <p className="text-muted-foreground">Create and manage your data visualizations</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Visualization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Visualization</DialogTitle>
              <DialogDescription>
                Select a dataset and visualization type to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right">
                  Title
                </label>
                <Input id="title" className="col-span-3" placeholder="Q1 Sales Analysis" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right">
                  Description
                </label>
                <Input
                  id="description"
                  className="col-span-3"
                  placeholder="Quarterly sales breakdown by region"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dataset" className="text-right">
                  Dataset
                </label>
                <Select>
                  <SelectTrigger id="dataset" className="col-span-3">
                    <SelectValue placeholder="Select a dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasets.map((dataset) => (
                      <SelectItem key={dataset.id} value={dataset.id}>
                        {dataset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="type" className="text-right">
                  Chart Type
                </label>
                <Select>
                  <SelectTrigger id="type" className="col-span-3">
                    <SelectValue placeholder="Select a chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="scatter">Scatter Plot</SelectItem>
                    <SelectItem value="heatmap">Heat Map</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search visualizations..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Chart Type</DropdownMenuItem>
              <DropdownMenuItem>Dataset</DropdownMenuItem>
              <DropdownMenuItem>Date Created</DropdownMenuItem>
              <DropdownMenuItem>Created By</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-40 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-8 w-20" />
                  </CardFooter>
                </Card>
              ))
            ) : visualizations.length > 0 ? (
              visualizations.map((viz) => (
                <Card key={viz.id}>
                  <CardHeader>
                    <CardTitle>{viz.title}</CardTitle>
                    <CardDescription>{viz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 w-full bg-muted rounded-md flex items-center justify-center">
                      {viz.thumbnail ? (
                        <img
                          src={viz.thumbnail}
                          alt={viz.title}
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          {getChartIcon(viz.type)}
                          <span className="mt-2 text-sm capitalize">{viz.type} Chart</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Dataset: {viz.dataset}</p>
                      <p>Created: {viz.dateCreated}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Export as PNG</DropdownMenuItem>
                        <DropdownMenuItem>Export as SVG</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center h-64">
                <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No visualizations found</h3>
                <p className="text-muted-foreground">Create a visualization to get started</p>
                <Button className="mt-4" onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Visualization
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="list">
          <div className="space-y-4">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))
            ) : visualizations.length > 0 ? (
              visualizations.map((viz) => (
                <div
                  key={viz.id}
                  className="flex items-center space-x-4 p-4 border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                    {viz.thumbnail ? (
                      <img
                        src={viz.thumbnail}
                        alt={viz.title}
                        className="h-full w-full object-cover rounded-md"
                      />
                    ) : (
                      getChartIcon(viz.type)
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{viz.title}</h3>
                    <p className="text-sm text-muted-foreground">{viz.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                      <span>Dataset: {viz.dataset}</span>
                      <span>•</span>
                      <span>Created: {viz.dateCreated}</span>
                      <span>•</span>
                      <span className="capitalize">{viz.type} Chart</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No visualizations found</h3>
                <p className="text-muted-foreground">Create a visualization to get started</p>
                <Button className="mt-4" onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Visualization
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}