// app/(protected)/datasets/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useData } from "@/hooks/use-data";
import { Upload, FileText, Filter, MoreHorizontal, Search, Plus, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { permissions, parse } from "@/lib/utils";

type Dataset = {
  id: string;
  name: string;
  description: string;
  file_path: string;
  file_type: string;
  row_count: number;
  created_at: string;
  updated_at: string;
};

export default function DatasetsPage() {
  const { fetchDatasets, createDataset } = useData();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(0);

  const [upLoad, setUpLoad] = useState(false);
  const [tag, setTag] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  // const debouncedSearch = useDebounce(searchQuery, 500);

  const controller = new AbortController(); // 创建 AbortController
  const signal = controller.signal; // 获取 signal
  
  useEffect(() => {
    return () => {
      controller.abort(); // 组件卸载时取消请求
    }
  },[])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // const data = await fetchDatasets({ query: debouncedSearch });
        const data = await fetchDatasets(signal);

        setDatasets(data.items);
        setTag(false);
      } catch (error) {
        console.error("Failed to load datasets:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleFileUpload = async () => {
      try {
        if (!file) {
          alert('Please select a file');
          throw new Error('Please select a file');
        }

        // 可以创建一个FormData对象用于API提交
        const formData = new FormData();

        // Add the JSON data as a form field
        const datasetIn = {
          name: name,
          description: description
        };
        formData.append('dataset_in', JSON.stringify(datasetIn));

        // Add the file
        formData.append('file', file as File);

        // 发送POST请求
        const response = await createDataset(formData, signal);
        console.log(response);
      } catch (error) {
        alert('Failed to upload file')
        console.error("Failed to upload file:", error);
      } finally {
        // 上传完成后关闭对话框
        setIsUploadOpen(false);
        setUpLoad(false);

        // 重置表单
        setName('');
        setDescription('');
        setFile(null);
      }
    };

    if (permissions()) {
      if (upLoad) {
        handleFileUpload();
      } else if (!upLoad && tag) {
        loadData();
      }
    } else {
      router.push('/login')
    }

  }, [upLoad]);//fetchDatasets, debouncedSearch

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Datasets</h1>
          <p className="text-muted-foreground">Manage and explore your data sources</p>
        </div>

        {loading ? <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Dataset
        </Button> :
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Dataset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Dataset</DialogTitle>
                <DialogDescription>
                  Upload a CSV, Excel, or JSON file to create a new dataset.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input
                    id="name"
                    className="col-span-3"
                    placeholder="Sales Data 2025"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="col-span-3 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="file" className="text-right">
                    File
                  </label>
                  <Input
                    id="file"
                    type="file"
                    className="col-span-3"
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={(e) => setFile(e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => setUpLoad(true)}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search datasets..."
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
              <DropdownMenuItem>Date Created</DropdownMenuItem>
              <DropdownMenuItem>File Size</DropdownMenuItem>
              <DropdownMenuItem>File Type</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead className="w-[50px]">Name</TableHead>
                  <TableHead className="w-[150px]">Description</TableHead>
                  <TableHead>File Path</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Row Count</TableHead>
                  <TableHead>Create Time</TableHead>
                  <TableHead>Update Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : datasets.length > 0 ? (
                  // Only show 5 items per page using pagination
                  datasets
                    .slice(page * 5, (page + 1) * 5)
                    .map((dataset) => (
                      <TableRow key={dataset.id}>
                        <TableCell>{dataset.id}</TableCell>
                        <TableCell className="font-medium">{dataset.name}</TableCell>
                        <TableCell>{dataset.description}</TableCell>
                        <TableCell>{parse(dataset.file_path)}</TableCell>
                        <TableCell>{dataset.file_type.toUpperCase()}</TableCell>
                        <TableCell>{dataset.row_count}</TableCell>
                        <TableCell>{dataset.created_at}</TableCell>
                        <TableCell>{dataset.updated_at}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Create Visualization</DropdownMenuItem>
                              <DropdownMenuItem>Export</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No datasets found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination controls */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <Button
                className="ml-4"
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                第 {page + 1} 页 | 共 {Math.max(1, Math.ceil(datasets.length / 5))} 页
              </div>
              <Button
                className="mr-4"
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(Math.ceil(datasets.length / 5) - 1, page + 1))}
                disabled={page >= Math.ceil(datasets.length / 5) - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grid">
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
                  <CardFooter>
                    <Skeleton className="h-8 w-20" />
                  </CardFooter>
                </Card>
              ))
            ) : datasets.length > 0 ? (
              // Only show 5 items per page using pagination
              datasets
                .slice(page * 6, (page + 1) * 6)
                .map((dataset) => (
                  <Card key={dataset.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">{dataset.name}</CardTitle>
                      <CardDescription>{dataset.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md p-4 bg-gray-50 dark:bg-gray-800 mb-4">
                        <p className="text-xl font-semibold mb-3">Basic information:</p>
                        <p className="text-sm py-1 flex justify-between">
                          <span className="font-medium">File Name:</span>
                          <span>{parse(dataset.file_path) || 'null'}</span>
                        </p>
                        <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                          <span className="font-medium">File Type:</span>
                          <span>{dataset.file_type.toUpperCase() || 'null'}</span>
                        </p>
                        <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                          <span className="font-medium">Row Count:</span>
                          <span>{dataset.row_count || 'null'}</span>
                        </p>
                        <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                          <span className="font-medium">Create Time:</span>
                          <span>{dataset.created_at || 'null'}</span>
                        </p>
                        <p className="text-sm py-1 flex justify-between border-t border-gray-200 dark:border-gray-700">
                          <span className="font-medium">Updated Time:</span>
                          <span>{dataset.updated_at || 'null'}</span>
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Create Visualization</DropdownMenuItem>
                          <DropdownMenuItem>Export</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center h-64">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No datasets found</h3>
                <p className="text-muted-foreground">Upload a dataset to get started</p>
                <Button className="mt-4" onClick={() => setIsUploadOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Dataset
                </Button>
              </div>
            )}
          </div>

          {/* Pagination controls - added to match table implementation */}
          {datasets.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                第 {page + 1} 页 | 共 {Math.max(1, Math.ceil(datasets.length / 6))} 页
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(Math.ceil(datasets.length / 6) - 1, page + 1))}
                disabled={page >= Math.ceil(datasets.length / 6) - 1}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}