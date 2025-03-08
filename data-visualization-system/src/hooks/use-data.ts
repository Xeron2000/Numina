// hooks/use-data.ts
import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from './use-auth';
import { 
  Dataset, 
  Visualization, 
  AnalyticsData, 
  User, 
  DatasetCreateParams, 
  VisualizationCreateParams,
  PaginationParams,
  SearchParams
} from '@/lib/types';

export function useData() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard Data
  const fetchDashboardSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Datasets
  const fetchDatasets = useCallback(async (params?: PaginationParams & SearchParams) => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/datasets', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching datasets:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDatasetById = useCallback(async (datasetId: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/datasets/${datasetId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dataset ${datasetId}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDataset = useCallback(async (data: DatasetCreateParams) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Append file if exists
      if (data.file) {
        formData.append('file', data.file);
      }
      
      // Append other data as JSON
      const { file, ...restData } = data;
      formData.append('data', JSON.stringify(restData));
      
      const response = await api.post('/api/datasets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Dataset created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating dataset:', error);
      toast.error('Failed to create dataset');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDataset = useCallback(async (datasetId: string, data: Partial<Dataset>) => {
    try {
      setIsLoading(true);
      const response = await api.put(`/api/datasets/${datasetId}`, data);
      toast.success('Dataset updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Error updating dataset ${datasetId}:`, error);
      toast.error('Failed to update dataset');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDataset = useCallback(async (datasetId: string) => {
    try {
      setIsLoading(true);
      await api.delete(`/api/datasets/${datasetId}`);
      toast.success('Dataset deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting dataset ${datasetId}:`, error);
      toast.error('Failed to delete dataset');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Visualizations
  const fetchVisualizations = useCallback(async (params?: PaginationParams & SearchParams) => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/visualizations', { params });
      return (response.data as any[]).map(item => ({
        id: item.id,
        title: item.name,
        description: item.description,
        type: item.type,
        dataset: item.datasetId,
        dateCreated: item.createdAt,
        lastModified: item.updatedAt,
        createdBy: item.createdBy,
        thumbnail: item.thumbnail,
      })) as Visualization[];
    } catch (error) {
      console.error('Error fetching visualizations:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVisualizationById = useCallback(async (visualizationId: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/visualizations/${visualizationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching visualization ${visualizationId}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVisualization = useCallback(async (data: VisualizationCreateParams) => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/visualizations', data);
      toast.success('Visualization created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating visualization:', error);
      toast.error('Failed to create visualization');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateVisualization = useCallback(async (visualizationId: string, data: Partial<Visualization>) => {
    try {
      setIsLoading(true);
      const response = await api.put(`/api/visualizations/${visualizationId}`, data);
      toast.success('Visualization updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Error updating visualization ${visualizationId}:`, error);
      toast.error('Failed to update visualization');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteVisualization = useCallback(async (visualizationId: string) => {
    try {
      setIsLoading(true);
      await api.delete(`/api/visualizations/${visualizationId}`);
      toast.success('Visualization deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting visualization ${visualizationId}:`, error);
      toast.error('Failed to delete visualization');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analytics
  const fetchAnalyticsData = useCallback(async (timeRange: string = '7d'): Promise<AnalyticsData> => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/analytics', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportAnalyticsData = useCallback(async (timeRange: string = '7d') => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/analytics/export', { 
        params: { timeRange },
        responseType: 'blob'
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Settings
  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/settings/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      const response = await api.put('/api/settings/profile', data);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await api.put('/api/settings/password', { currentPassword, newPassword });
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    // Dashboard
    fetchDashboardStats,
    fetchDashboardSummary,
    // Datasets
    fetchDatasets,
    fetchDatasetById,
    createDataset,
    updateDataset,
    deleteDataset,
    // Visualizations
    fetchVisualizations,
    fetchVisualizationById,
    createVisualization,
    updateVisualization,
    deleteVisualization,
    // Analytics
    fetchAnalyticsData,
    exportAnalyticsData,
    // Settings
    fetchUserProfile,
    updateUserProfile,
    changePassword
  };
}