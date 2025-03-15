# Numina 数据分析可视化系统 - 前端文档

## 1. 项目概述

Numina 是一个基于 Next.js 和 FastAPI 构建的现代数据分析可视化系统。前端采用 React 框架（Next.js）结合 TailwindCSS 和 shadcn/ui 组件库，提供了直观、美观且功能强大的用户界面，方便用户进行数据分析和可视化操作。

## 2. 技术栈

- **框架**: Next.js (React)
- **样式**: TailwindCSS
- **UI 组件**: shadcn/ui
- **后端**: FastAPI
- **数据库**: SQLite
- **HTTP 客户端**: Axios
- **状态管理**: React Hooks (自定义 hooks)

## 3. 项目结构

### 3.1 目录结构

```
.
├── app                     # Next.js 应用主目录
│   ├── (auth)              # 认证相关页面
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 主布局
│   ├── page.tsx            # 主页
│   └── (protected)         # 需要身份验证的页面
├── components              # 组件目录
│   ├── analytics           # 分析相关组件
│   ├── charts              # 图表组件
│   ├── dashboard           # 仪表盘组件
│   ├── layout              # 布局组件
│   └── ui                  # UI 基础组件
├── hooks                   # 自定义 React Hooks
└── lib                     # 工具函数和类型定义
    ├── api.ts              # API 服务配置
    ├── types.ts            # TypeScript 类型定义
    └── utils.ts            # 工具函数
```

### 3.2 核心模块

- **认证模块** (`app/(auth)`): 包含登录、注册等身份验证页面
- **仪表盘模块** (`app/(protected)/dashboard`): 用户主控制台
- **数据集模块** (`app/(protected)/datasets`): 管理数据集
- **可视化模块** (`app/(protected)/visualizations`): 创建和管理可视化
- **分析模块** (`app/(protected)/analytics`): 数据分析功能
- **设置模块** (`app/(protected)/settings`): 用户和系统设置

## 4. 组件设计

### 4.1 图表组件 (`components/charts`)

系统包含多种图表类型:
- `BarChart.tsx`: 柱状图
- `LineChart.tsx`: 折线图
- `PieChart.tsx`: 饼图

这些组件基于 React 和 shadcn/ui 构建，用于可视化数据。

### 4.2 布局组件 (`components/layout`)

- `SideNavigation.tsx`: 侧边导航栏
- `TopBar.tsx`: 顶部导航栏

### 4.3 分析组件 (`components/analytics`)

- `ChartActions.tsx`: 图表操作按钮
- `MetricCard.tsx`: 指标卡片

### 4.4 UI 组件 (`components/ui`)

包含 shadcn/ui 提供的各种基础 UI 组件，如按钮、卡片、表单元素等。

## 5. 自定义 Hooks

- `use-auth.ts`: 处理身份验证相关逻辑
- `use-data.ts`: 数据获取和处理
- `use-debounce.ts`: 实现防抖功能

## 6. 与后端集成

### 6.1 API 服务配置

前端使用 Axios 与后端 FastAPI 进行通信。API 服务的配置在 `lib/api.ts` 中定义：

```typescript
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 数据集服务
export const datasetService = {
  getAll: () => api.get('/api/datasets').then(res => res.data),
  getById: (id: string) => api.get(`/api/datasets/${id}`).then(res => res.data),
  create: (data: any) => api.post('/api/datasets', data).then(res => res.data),
  update: (id: string, data: any) => api.put(`/api/datasets/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/api/datasets/${id}`).then(res => res.data),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  }
};

// 可视化服务
export const visualizationService = {
  getAll: () => api.get('/api/visualizations').then(res => res.data),
  getById: (id: string) => api.get(`/api/visualizations/${id}`).then(res => res.data),
  create: (data: any) => api.post('/api/visualizations', data).then(res => res.data),
  update: (id: string, data: any) => api.put(`/api/visualizations/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/api/visualizations/${id}`).then(res => res.data),
};

// 分析服务
export const analyticsService = {
  executeQuery: (query: any) => api.post('/api/analytics/query', query).then(res => res.data),
  getSavedQueries: () => api.get('/api/analytics/saved-queries').then(res => res.data),
  saveQuery: (query: any) => api.post('/api/analytics/saved-queries', query).then(res => res.data),
};

// 认证服务
export const authService = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/auth/login', credentials).then(res => res.data),
  register: (userData: { email: string; password: string; name: string }) =>
    api.post('/api/auth/register', userData).then(res => res.data),
  logout: () => api.post('/api/auth/logout').then(res => res.data),
  getProfile: () => api.get('/api/auth/profile').then(res => res.data),
};

export default api;
```

### 6.2 身份验证集成

前端通过 `authService` 进行身份验证操作。认证令牌保存在 localStorage 中，并通过 Axios 拦截器自动添加到每个请求的头部。

通常搭配自定义 Hook `use-auth.ts` 使用:

```typescript
// 示例: hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { authService } from '@/lib/api';
import { User } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 检查用户会话
    async function checkSession() {
      try {
        const { data } = await authService.getProfile();
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    
    checkSession();
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        setUser(response.user);
      }
      return response;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await authService.logout();
      localStorage.removeItem('auth_token');
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
}
```

## 7. 数据类型定义

系统使用 TypeScript 定义了一系列类型，存放在 `lib/types.ts` 中：

### 7.1 用户相关类型

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "user" | "viewer";
  createdAt: string;
  updatedAt: string;
  settings?: UserSettings;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  twoFactorEnabled: boolean;
}
```

### 7.2 数据集相关类型

```typescript
export interface Dataset {
  id: string;
  name: string;
  description?: string;
  type: "csv" | "json" | "excel" | "database" | "api";
  source: string;
  size: number;
  rowCount: number;
  columnCount: number;
  sampleData?: any;
  schema?: SchemaField[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags?: string[];
}

export interface SchemaField {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "object" | "array";
  nullable: boolean;
  description?: string;
}

```

### 7.3 可视化相关类型

```typescript
export interface Visualization {
  id: string;
  title: string;
  description: string;
  type: "bar" | "line" | "pie" | "scatter" | "heatmap" | "area";
  dataset: string;
  dateCreated: string;
  lastModified: string;
  createdBy: string;
  thumbnail?: string;
}

export interface VisualizationConfig {
  dimensions: string[];
  measures: string[];
  sorting?: {
    field: string;
    direction: "asc" | "desc";
  };
  filters?: VisualizationFilter[];
  appearance?: {
    colors?: string[];
    legend?: boolean;
    title?: string;
    subtitle?: string;
    gridLines?: boolean;
    xAxisLabel?: string;
    yAxisLabel?: string;
  };
}

export interface VisualizationFilter {
  field: string;
  operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains" | "in" | "between";
  value: any;
}

export interface VisualizationCreateParams {
  title: string;
  description?: string;
  type: Visualization["type"];
  dataset: string;
  config: VisualizationConfig;
  isPublic?: boolean;
  tags?: string[];
}
```

### 7.4 分析相关类型

```typescript
export interface AnalyticsData {
  // Metrics
  usersMetric: Metric;
  datasetsMetric: Metric;
  visualizationsMetric: Metric;
  activityMetric: Metric;
  // Charts
  userActivityChart: Chart<UserActivityPoint>;
  dataProcessedChart: Chart<DataProcessedPoint>;
  systemPerformanceChart: Chart<SystemPerformancePoint>;
  userSessionsChart: Chart<UserSessionsPoint>;
  datasetDistributionChart: Chart<DatasetDistributionPoint>;
  visualizationTypesChart: Chart<VisualizationTypesPoint>;
}

export interface Metric {
  value: number;
  change: number; // Percentage change
  trend?: "up" | "down" | "stable";
}

export interface Chart<T> {
  title: string;
  data: T[];
}

// 其他分析相关接口定义...
```

### 7.5 通用类型

```typescript
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  };
}
```

## 8. 所需后端 API 接口

根据前端服务的实现，后端需要提供以下 API 接口:

### 8.1 认证接口

- `POST /api/auth/login`: 用户登录
- `POST /api/auth/register`: 用户注册
- `POST /api/auth/logout`: 用户登出
- `GET /api/auth/profile`: 获取当前用户信息

### 8.2 数据集接口

- `GET /api/datasets`: 获取数据集列表
- `GET /api/datasets/{id}`: 获取特定数据集
- `POST /api/datasets`: 创建新数据集
- `PUT /api/datasets/{id}`: 更新数据集
- `DELETE /api/datasets/{id}`: 删除数据集
- `POST /api/datasets/upload`: 上传数据集文件

### 8.3 可视化接口

- `GET /api/visualizations`: 获取可视化列表
- `GET /api/visualizations/{id}`: 获取特定可视化
- `POST /api/visualizations`: 创建新可视化
- `PUT /api/visualizations/{id}`: 更新可视化
- `DELETE /api/visualizations/{id}`: 删除可视化

### 8.4 分析接口

- `POST /api/analytics/query`: 执行自定义数据查询
- `GET /api/analytics/saved-queries`: 获取已保存的查询
- `POST /api/analytics/saved-queries`: 保存新查询

## 9. API 响应格式

后端应返回符合以下格式的 JSON 数据:

```json
{
  "data": {
    // 主要数据内容...
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## 10. 数据处理示例

### 10.1 获取数据集列表

```typescript
import { useEffect, useState } from 'react';
import { datasetService } from '@/lib/api';
import { Dataset, ApiResponse } from '@/lib/types';

function DatasetsList() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const response: ApiResponse<Dataset[]> = await datasetService.getAll();
        setDatasets(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch datasets');
      } finally {
        setLoading(false);
      }
    }

    fetchDatasets();
  }, []);

  // 渲染组件...
}
```

### 10.2 创建可视化

```typescript
import { useState } from 'react';
import { visualizationService } from '@/lib/api';
import { VisualizationCreateParams } from '@/lib/types';

function CreateVisualization() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: VisualizationCreateParams) {
    setLoading(true);
    setError(null);
    
    try {
      const response = await visualizationService.create(data);
      // 处理成功响应...
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create visualization');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // 渲染组件...
}
```

## 11. 部署说明

### 11.1 环境变量配置

前端需要配置以下环境变量:

```
NEXT_PUBLIC_API_URL=http://localhost:8000  # 后端 API 地址
```

### 11.2 构建与部署

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 构建生产版本
npm run build

# 启动生产版本
npm run start
```

## 12. 前端开发指南

### 12.1 添加新页面

1. 在 `app` 目录下创建新的页面文件，比如 `app/(protected)/reports/page.tsx`
2. 将页面与应用的路由系统集成

### 12.2 添加新组件

1. 在 `components` 目录下适当的子目录中创建新组件
2. 导出组件并在页面中使用它

### 12.3 调用API

1. 在 `lib/api.ts` 中已有的服务对象中添加新方法，或创建新的服务对象
2. 在组件中导入并使用服务方法获取或发送数据

```typescript
import { datasetService } from '@/lib/api';

// 调用API
const datasets = await datasetService.getAll();
```

## 13. 常见问题解答

### 13.1 API 连接问题

如果遇到 API 连接问题，请检查:
- 环境变量 `NEXT_PUBLIC_API_URL` 是否正确设置
- 后端服务是否正在运行
- 网络请求是否被浏览器CORS政策阻止

### 13.2 身份验证问题

如果遇到身份验证问题:
- 检查 localStorage 中的 `auth_token` 是否存在
- 确认令牌格式是否正确
- 验证令牌是否过期

### 13.3 数据类型错误

如果遇到类型错误:
- 检查后端返回的数据结构是否与 `lib/types.ts` 中定义的接口匹配
- 考虑使用类型断言或修改类型定义以匹配实际数据

## 14. 测试与调试

### 14.1 开发工具

- 使用浏览器开发者工具查看网络请求和响应
- 使用 React 开发者工具检查组件状态和属性

### 14.2 常见调试模式

```typescript
// 在API请求前后添加日志
async function fetchData() {
  console.log('Fetching data...');
  try {
    const response = await datasetService.getAll();
    console.log('Received data:', response);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
```