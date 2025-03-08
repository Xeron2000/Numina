// lib/types.ts
import { ReactNode } from "react";

// User related types
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

// Dataset related types
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

export interface DatasetCreateParams {
  name: string;
  description?: string;
  type: Dataset["type"];
  source: string;
  file?: File;
  isPublic?: boolean;
  tags?: string[];
}

// Visualization related types
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

// Analytics related types
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

export interface UserActivityPoint {
  date: string;
  users: number;
}

export interface DataProcessedPoint {
  date: string;
  value: number;
}

export interface SystemPerformancePoint {
  date: string;
  value: number;
  metric: "cpu" | "memory" | "disk" | "network";
}

export interface UserSessionsPoint {
  hour: number;
  sessions: number;
}

export interface DatasetDistributionPoint {
  type: string;
  count: number;
}

export interface VisualizationTypesPoint {
  type: string;
  count: number;
}

// Common types
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