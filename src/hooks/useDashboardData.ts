// src/hooks/useDashboardData.ts
import { api } from '@/lib/api';
import { type DateRange } from 'react-day-picker';
import { skipToken } from '@tanstack/react-query';
import type { 
  DashboardStats, 
  DepartmentOccupancy, 
  DischargeData,
  ChartDataPoint 
} from '@/components/dashboard/types';

/**
 * Centralized hook for dashboard data fetching
 * Manages data fetching, transformation, and error handling for all dashboard metrics
 */
export function useDashboardData(dateRange: DateRange | undefined, selectedDepartments: string[]) {
  // Get today's date in YYYY-MM-DD format as a fallback
  const today = new Date().toISOString().split('T')[0];
  const startDate = dateRange?.from ? dateRange.from.toISOString().split('T')[0] : today;
  const endDate = dateRange?.to ? dateRange.to.toISOString().split('T')[0] : today;

  // Shared query options for consistent behavior
  const queryOptions = {
    enabled: selectedDepartments.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry twice for network issues
    refetchOnWindowFocus: false,
  };

  // Get current stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: statsError,
  } = api.dashboard.getDashboardStats.useQuery(
    selectedDepartments.length > 0 && endDate ? { date: endDate } : skipToken,
    queryOptions
  );

  // Get historical data
  const {
    data: historicalData,
    isLoading: isLoadingHistorical,
    isError: isErrorHistorical,
    error: historicalError,
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
    }
  );

  // Get department occupancy
  const {
    data: occupancy,
    isLoading: isLoadingOccupancy,
    isError: isErrorOccupancy,
    error: occupancyError,
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
    error: dischargeError,
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

  // Collect all errors
  const errors = [
    statsError, 
    historicalError, 
    occupancyError, 
    dischargeError
  ].filter(Boolean);

  // Process historical data to include all metrics
  const enhancedHistorical = (historicalData ?? []).map(item => {
    // Basic type with required fields
    const basicItem: ChartDataPoint = {
      date: item.date,
      current_patients: item.current_patients,
    };
    
    // Calculate or derive additional metrics
    return {
      ...basicItem,
      // If occupancy_rate isn't included, calculate a reasonable estimate
      occupancy_rate: 'occupancy_rate' in item 
        ? (item as any).occupancy_rate 
        : (item.current_patients / 100), // Simple approximation
      
      // Include other metrics if they're available from the API
      admissions: 'admissions' in item ? (item as any).admissions : 0,
      discharges: 'discharges' in item ? (item as any).discharges : 0,
      ot_cases: 'ot_cases' in item ? (item as any).ot_cases : 0,
      
      // Calculate transfers if not provided
      transfers: 'transfers' in item 
        ? (item as any).transfers 
        : (('transfers_in' in item ? (item as any).transfers_in : 0) + 
           ('transfers_out' in item ? (item as any).transfers_out : 0)),
      
      // Preserve any other fields from the original item
      ...(item as any),
    };
  });

  // Return normalized and type-safe data
  return {
    stats: stats,
    historical: enhancedHistorical,
    occupancy: occupancy,
    discharges: discharges,
    isLoading,
    isError,
    errors
  };
}