// src/lib/hooks/useDashboardData.ts

import { api } from '@/lib/api';
import { type DateRange } from 'react-day-picker';
import { departmentService } from '@/lib/services/departmentService';
import type { 
  DashboardStats, 
  DischargeData
} from '@/components/dashboard/types';
import type { CensusEntry } from '@/types/database';
import { skipToken } from '@tanstack/react-query';

// const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export function useDashboardData(dateRange: DateRange | undefined, selectedDepartments: string[]) {
  // Get today's date in YYYY-MM-DD format as a fallback
  const today = new Date().toISOString().split('T')[0];      
  // Ensure we always have valid date strings
  const startDate = dateRange?.from ? dateRange.from.toISOString().split('T')[0] : today;
  const endDate = dateRange?.to ? dateRange.to.toISOString().split('T')[0] : today;

  // Get current stats
  const { 
    data: statsData, 
    isLoading: isLoadingStats 
  } = api.dashboard.getDashboardStats.useQuery(
    selectedDepartments.length > 0 && endDate ? { date: endDate } : skipToken,
    { 
      enabled: selectedDepartments.length > 0 && !!endDate,
      // select: (data: { totalPatients: number; otCases: number; patientFlow: { in: number; out: number; } }) => {

      select: (data: CensusEntry[]) => {
        const stats: DashboardStats = {
          totalPatients: 0,
          otCases: 0,
          patientFlow: { in: 0, out: 0 },
          occupancyRate: 0
        };

        // Process each census entry
        data.forEach(entry => {
          if (entry.current_patients) stats.totalPatients += entry.current_patients;
          if (entry.ot_cases) stats.otCases += entry.ot_cases;
          if (entry.total_transfers_in) stats.patientFlow.in += entry.total_transfers_in;
          if (entry.total_transfers_out) stats.patientFlow.out += entry.total_transfers_out;
        });

        // Calculate overall occupancy rate
        const totalBeds = departmentService.getTotalHospitalBeds();
        stats.occupancyRate = (stats.totalPatients / totalBeds) * 100;

        return stats;
      }
    }
  );

  // Get historical data
  const {
    data: historicalData,
    isLoading: isLoadingHistorical
  } = api.dashboard.getHistoricalData.useQuery(
    selectedDepartments.length > 0 && startDate && endDate 
      ? {
          startDate,
          endDate,
          departments: selectedDepartments
        }
      : skipToken,
    {
      enabled: selectedDepartments.length > 0 && !!startDate && !!endDate,
      select: (data: CensusEntry[]) => {
        return data.map(entry => ({
          date: entry.date,
          value: entry.current_patients ?? 0
        }));
      }
    }
  );

    // Get department occupancy
    const {
      data: occupancyData,
      isLoading: isLoadingOccupancy
    } = api.dashboard.getDepartmentOccupancy.useQuery(
      selectedDepartments.length > 0 
        ? { departments: selectedDepartments }
        : skipToken,
      {
        enabled: selectedDepartments.length > 0,
        select: (data: CensusEntry[]) => {
          return data.map(entry => ({
            department: entry.department,
            current: entry.current_patients ?? 0,
            total: departmentService.getDepartmentTotalBeds(entry.department),
            percentage: departmentService.calculateDepartmentOccupancy(
              entry.department, 
              entry.current_patients ?? 0
            )
          }));
        }
      }
    );
  
    // Get discharge data
    const {
      data: dischargeData,
      isLoading: isLoadingDischarge
    } = api.dashboard.getDischargeAnalytics.useQuery(
      selectedDepartments.length > 0 && startDate && endDate
        ? {
            startDate,
            endDate,
            departments: selectedDepartments
          }
        : skipToken,
      {
        enabled: selectedDepartments.length > 0 && !!startDate && !!endDate,
        select: (data) => data as DischargeData[]
      }
    );

  return {
    stats: statsData,
    historical: historicalData,
    occupancy: occupancyData,
    discharges: dischargeData,
    isLoading: isLoadingStats || isLoadingHistorical || 
               isLoadingOccupancy || isLoadingDischarge
  };
}