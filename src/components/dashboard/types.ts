// src/components/dashboard/types.ts
import type { CensusEntry } from '@/lib/schemas/census';
import type { Department, DepartmentOccupancy } from '@/types/department';

// Re-export from centralized types for backward compatibility
export type { Department, DepartmentOccupancy };

// Dashboard statistics
export interface DashboardStats {
  totalPatients: number;
  otCases: number;
  patientFlow: {
    in: number;
    out: number;
  };
  occupancyRate?: number;
}

// Chart data point type
export interface ChartDataPoint {
  date: string;
  current_patients: number;
  admissions?: number;
  discharges?: number;
  ot_cases?: number;
  transfers_in?: number;
  transfers_out?: number;
  transfers?: number; // Combined transfers (in + out)
  occupancy_rate?: number;
  metadata?: Record<string, unknown>;
  department?: string;
}

// Discharge analytics data
export interface DischargeData {
  department: string;
  recovered: number;
  lama: number;
  absconded: number;
  referred: number;
  notImproved: number;
  deaths: number;
}

// Dashboard API response type
export interface DashboardResponse {
  stats: DashboardStats;
  historical?: ChartDataPoint[];
  occupancy?: DepartmentOccupancy[];
  discharges?: DischargeData[];
}

// Date range filter input
export interface DateRangeInput {
  startDate: string;
  endDate: string;
  departments: string[];
}

// Chart configuration
export interface ChartConfig {
  id: string;
  name: string;
  type: 'line' | 'bar' | 'area';
  dataKey: keyof CensusEntry;
  color?: string;
}