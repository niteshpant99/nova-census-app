// src/types/department.ts

/**
 * Department structure for Nova Hospital
 */
export interface Department {
  /** Unique identifier for the department */
  id: string;
  
  /** Display name of the department */
  name: string;
  
  /** Total number of beds in the department */
  totalBeds: number;
  
  /** Parent department ID (if this is a child department) */
  parentId?: string;
  
  /** Child departments (if this is a parent department) */
  subUnits?: Department[];
}

/**
 * Department occupancy information
 */
export interface DepartmentOccupancy {
  /** Department identifier */
  department: string;
  
  /** Current number of patients */
  current: number;
  
  /** Total capacity (beds) */
  total: number;
  
  /** Occupancy percentage (0-100) */
  percentage: number;
}