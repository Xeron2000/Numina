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
  VisualizationCreateParams,
  PaginationParams,
  SearchParams
} from '@/lib/types';

import { recentData } from '@/lib/utils';

export function useData() {
  const { user } = useAuth();

  // Datasets
  const fetchDatasets = async (signal: AbortSignal) => {
    try {
      const response = await api.get('/api/datasets', { signal });
      return response.data;
    } catch (error) {
      console.error('Error fetching datasets:', error);
      throw error;
    }
  };

  const fetchDatasetById = useCallback(async (datasetId: string) => {
    try {
      const response = await api.get(`/api/datasets/${datasetId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dataset ${datasetId}:`, error);
      throw error;
    }
  }, []);

  const createDataset = async (formData: FormData, signal: AbortSignal) => {
    try {
      const response = await api.post('/api/datasets', formData, {
        signal: signal,
      });

      toast.success('Dataset created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating dataset:', error);
      toast.error('Failed to create dataset');
      throw error;
    }
  };

  const updateDataset = useCallback(async (datasetId: string, data: Partial<Dataset>) => {
    try {
      const response = await api.put(`/api/datasets/${datasetId}`, data);
      toast.success('Dataset updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Error updating dataset ${datasetId}:`, error);
      toast.error('Failed to update dataset');
      throw error;
    }
  }, []);

  const deleteDataset = useCallback(async (datasetId: string) => {
    try {
      await api.delete(`/api/datasets/${datasetId}`);
      toast.success('Dataset deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting dataset ${datasetId}:`, error);
      toast.error('Failed to delete dataset');
      throw error;
    }
  }, []);

  // Visualizations
  const fetchVisualizations = useCallback(async (params?: PaginationParams & SearchParams) => {
    try {
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
    }
  }, []);

  const fetchVisualizationById = useCallback(async (visualizationId: string) => {
    try {
      const response = await api.get(`/api/visualizations/${visualizationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching visualization ${visualizationId}:`, error);
      throw error;
    }
  }, []);

  const createVisualization = useCallback(async (data: VisualizationCreateParams) => {
    try {
      const response = await api.post('/api/visualizations', data);
      toast.success('Visualization created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating visualization:', error);
      toast.error('Failed to create visualization');
      throw error;
    }
  }, []);

  const updateVisualization = useCallback(async (visualizationId: string, data: Partial<Visualization>) => {
    try {
      const response = await api.put(`/api/visualizations/${visualizationId}`, data);
      toast.success('Visualization updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Error updating visualization ${visualizationId}:`, error);
      toast.error('Failed to update visualization');
      throw error;
    }
  }, []);

  const deleteVisualization = useCallback(async (visualizationId: string) => {
    try {
      await api.delete(`/api/visualizations/${visualizationId}`);
      toast.success('Visualization deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting visualization ${visualizationId}:`, error);
      toast.error('Failed to delete visualization');
      throw error;
    }
  }, []);

  // Analytics
  const fetchAnalyticsData = useCallback(async (timeRange: string = '7d'): Promise<AnalyticsData> => {
    try {

      const response = await api.get('/api/analytics', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  }, []);

  const exportAnalyticsData = useCallback(async (timeRange: string = '7d') => {
    try {

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
    }
  }, []);

  // Settings
  const fetchUserProfile = useCallback(async () => {
    try {

      const response = await api.get('/api/settings/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }, []);

  const updateUserProfile = useCallback(async (data: Partial<User>) => {
    try {

      const response = await api.put('/api/settings/profile', data);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {

      await api.put('/api/settings/password', { currentPassword, newPassword });
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
      throw error;
    }
  }, []);

  const fetchDashboardStats = async (signal: AbortSignal) => {
    try {
      const response_datasets = await api.get('/api/datasets', { signal });
      const response_visualizations = await api.get('/api/visualizations', { signal })
      const response_analytics = await api.get('/api/analytics/saved-queries', { signal })

      const response = {
        'datasets':response_datasets.data.total,
        'visualizations':response_visualizations.data.total,
        'analytics':response_analytics.data.total,
        'allsets':{
          'datasets':recentData(response_datasets.data.items),
          'visualizations':recentData(response_visualizations.data.items),
          'analytics':recentData(response_analytics.data.items),
        }
      }
      return response;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  };

  return {
    // Dashboard
    fetchDashboardStats,
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