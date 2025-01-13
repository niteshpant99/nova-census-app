// src/lib/hooks/useDashboardData.ts
import { api } from '@/lib/api';
import { type DateRange } from 'react-day-picker';
import { skipToken } from '@tanstack/react-query';
import type { DashboardStats, DepartmentOccupancy, DischargeData } from '@/components/dashboard/types';

export function useDashboardData(dateRange: DateRange | undefined, selectedDepartments: string[]) {
  const today = new Date().toISOString().split('T')[0];
  const startDate = dateRange?.from ? dateRange.from.toISOString().split('T')[0] : today;
  const endDate = dateRange?.to ? dateRange.to.toISOString().split('T')[0] : today;

  const queryOptions = {
    enabled: selectedDepartments.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  };

  // Get current stats
  const {
    data: stats,
    isLoading: isLoadingStats,
  } = api.dashboard.getDashboardStats.useQuery(
    selectedDepartments.length > 0 && endDate ? { date: endDate } : skipToken,
    queryOptions
  );

  // Get historical data
  const {
    data: historicalData,
    isLoading: isLoadingHistorical,
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
      // Make sure we're returning the right data structure
      select: (data) => {
        if (!data) return [];
        
        return data.map(item => ({
          date: item.date,
          value: item.current_patients,
        }));
      }
    }
  );

  // Get department occupancy
  const {
    data: occupancy,
    isLoading: isLoadingOccupancy
  } = api.dashboard.getDepartmentOccupancy.useQuery(
    selectedDepartments.length > 0
      ? { departments: selectedDepartments }
      : skipToken,
    queryOptions
  );

  // Get discharge analytics
  const {
    data: discharges,
    isLoading: isLoadingDischarges
  } = api.dashboard.getDischargeAnalytics.useQuery(
    selectedDepartments.length > 0 && startDate && endDate
      ? {
          startDate,
          endDate,
          departments: selectedDepartments
        }
      : skipToken,
    queryOptions
  );

  return {
    stats,
    historical: historicalData,
    occupancy,
    discharges,
    isLoading: isLoadingStats || isLoadingHistorical || 
               isLoadingOccupancy || isLoadingDischarges
  };
}