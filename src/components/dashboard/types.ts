import type { CensusEntry } from '@/types/database';

// Stats response types
export interface DashboardStats {
  totalPatients: number;
  otCases: number;
  patientFlow: {
    in: number;
    out: number;
  };
  occupancyRate?: number;
}

// Department structure
export interface Department {
  id: string;
  name: string;
  totalBeds: number;
  parentId?: string;
  subUnits?: Department[];
}

// Chart data types
export interface ChartDataPoint {
  date: string;  // ISO date string format
  value: number;
  metadata?: Record<string, unknown>;  // More strict than any
  department?: string;
}

export interface DepartmentOccupancy {
  department: string;
  current: number;
  total: number;
  percentage: number;
}

export interface DischargeData {
  department: string;
  recovered: number;
  lama: number;
  absconded: number;
  referred: number;
  notImproved: number;
  deaths: number;
}

// API response types
export interface DashboardResponse {
  stats: DashboardStats;
  historical?: CensusEntry[];
  occupancy?: DepartmentOccupancy[];
  discharges?: DischargeData[];
}

// Date range type for filtering
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

export interface ChartDataPoint {
  date: string;
  current_patients: number;
}