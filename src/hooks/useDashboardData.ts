// src/lib/hooks/useDashboardData.ts
import { api } from '@/lib/api';
import { type DateRange } from 'react-day-picker';
import { skipToken } from '@tanstack/react-query';
import type { 
  DashboardStats, 
  DepartmentOccupancy, 
  DischargeData,
  ChartDataPoint 
} from '@/components/dashboard/types';

export function useDashboardData(dateRange: DateRange | undefined, selectedDepartments: string[]) {
  // Get today's date in YYYY-MM-DD format as a fallback
  const today = new Date().toISOString().split('T')[0];
  const startDate = dateRange?.from ? dateRange.from.toISOString().split('T')[0] : today;
  const endDate = dateRange?.to ? dateRange.to.toISOString().split('T')[0] : today;

  const queryOptions = {
    enabled: selectedDepartments.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry twice for network issues
  };

  // Get current stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = api.dashboard.getDashboardStats.useQuery(
    selectedDepartments.length > 0 && endDate ? { date: endDate } : skipToken,
    queryOptions
  );

  // Get historical data
  const {
    data: historicalData,
    isLoading: isLoadingHistorical,
    isError: isErrorHistorical,
  } = api.dashboard.getHistoricalData.useQuery(
    selectedDepartments.length > 0 && startDate && endDate
      ? {
          startDate,
          endDate,
          departments: selectedDepartments
        }
      : skipToken,
    {
      ...queryOptions,
      enabled: selectedDepartments.length > 0 && !!startDate && !!endDate,
      // Transform the data to match ChartDataPoint type while maintaining error handling
      select: (data) => {
        try {
          if (!data || !Array.isArray(data)) {
            console.warn('Invalid data structure received:', data);
            return [];
          }
          
          return data.map(item => ({
            date: item.date,
            current_patients: item.current_patients ?? 0, // Changed from value to current_patients
            // department: item.department,
            metadata: { 
              rawData: item,
              transformedAt: new Date().toISOString()
            }
          })) satisfies ChartDataPoint[];
        } catch (error) {
          console.error('Error transforming historical data:', error);
          return [];
        }
      },
    }
  );

  // Get department occupancy
  const {
    data: occupancy,
    isLoading: isLoadingOccupancy,
    isError: isErrorOccupancy,
  } = api.dashboard.getDepartmentOccupancy.useQuery(
    selectedDepartments.length > 0
      ? { departments: selectedDepartments }
      : skipToken,
    queryOptions
  );

  // Get discharge analytics
  const {
    data: discharges,
    isLoading: isLoadingDischarges,
    isError: isErrorDischarges,
  } = api.dashboard.getDischargeAnalytics.useQuery(
    selectedDepartments.length > 0 && startDate && endDate
      ? {
          startDate,
          endDate,
          departments: selectedDepartments
        }
      : skipToken,
    {
      ...queryOptions,
      enabled: selectedDepartments.length > 0 && !!startDate && !!endDate,
    }
  );

  // Combined loading and error states
  const isLoading = 
    isLoadingStats || 
    isLoadingHistorical || 
    isLoadingOccupancy || 
    isLoadingDischarges;

  const isError = 
    isErrorStats || 
    isErrorHistorical || 
    isErrorOccupancy || 
    isErrorDischarges;

  // Return normalized and type-safe data
  return {
    stats: stats,
    historical: historicalData ?? [],
    occupancy: occupancy,
    discharges: discharges,
    isLoading,
    isError
  };
}