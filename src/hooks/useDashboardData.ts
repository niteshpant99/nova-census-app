// src/lib/hooks/useDashboardData.ts
import { api } from '@/lib/api';
import { type DateRange } from 'react-day-picker';
import { skipToken } from '@tanstack/react-query';

export function useDashboardData(dateRange: DateRange | undefined, selectedDepartments: string[]) {
  // Get today's date in YYYY-MM-DD format as a fallback
  const today = new Date().toISOString().split('T')[0];
  // Ensure we always have valid date strings
  const startDate = dateRange?.from ? dateRange.from.toISOString().split('T')[0] : today;
  const endDate = dateRange?.to ? dateRange.to.toISOString().split('T')[0] : today;

  const queryOptions = {
    enabled: selectedDepartments.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry twice for network issues
  };

  // Get current stats
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = api.dashboard.getDashboardStats.useQuery(
    selectedDepartments.length > 0 && endDate ? { date: endDate } : skipToken,
    {
      ...queryOptions,
      enabled: selectedDepartments.length > 0 && !!endDate
    }
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
      enabled: selectedDepartments.length > 0 && !!startDate && !!endDate
    }
  );

  // Get department occupancy
  const {
    data: occupancyData,
    isLoading: isLoadingOccupancy,
    isError: isErrorOccupancy
  } = api.dashboard.getDepartmentOccupancy.useQuery(
    selectedDepartments.length > 0
      ? { departments: selectedDepartments }
      : skipToken,
    {
      ...queryOptions,
      enabled: selectedDepartments.length > 0,
    }
  );

  // Get discharge data
  const {
    data: dischargeData,
    isLoading: isLoadingDischarge,
    isError: isErrorDischarge
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

  const isLoading = isLoadingStats || isLoadingHistorical ||
    isLoadingOccupancy || isLoadingDischarge;
  const isError = isErrorStats || isErrorHistorical || isErrorOccupancy || isErrorDischarge;

  return {
    stats: statsData,
    historical: historicalData,
    occupancy: occupancyData,
    discharges: dischargeData,
    isLoading,
    isError
  };
}