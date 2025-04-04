// src/lib/services/departmentService.ts

import { 
  DEPARTMENTS, 
  getAllDepartments, 
  getDepartmentById 
} from '@/lib/config/departments';
import type { Department, DepartmentOccupancy } from '@/types/department';

/**
 * Service for department-related operations
 * 
 * This provides a central interface for accessing department data,
 * calculating metrics, and organizing departments into navigation sequences.
 */
class DepartmentService {
  /**
   * Get all departments, ordered for navigation
   */
  getOrderedDepartments(): Department[] {
    return getAllDepartments();
  }

  /**
   * Get department by ID
   */
  getDepartmentById(id: string): Department | undefined {
    return getDepartmentById(id);
  }

  /**
   * Get total number of beds in a department
   */
  getDepartmentBedCount(id: string): number {
    const dept = this.getDepartmentById(id);
    return dept?.totalBeds ?? 0;
  }

  /**
   * Calculate occupancy percentage for a department
   */
  calculateOccupancy(departmentId: string, currentPatients: number): number {
    const bedCount = this.getDepartmentBedCount(departmentId);
    
    if (bedCount === 0) return 0;
    
    return Math.round((currentPatients / bedCount) * 100);
  }

  /**
   * Get department name by ID
   */
  getDepartmentName(id: string): string {
    const dept = this.getDepartmentById(id);
    return dept?.name ?? id;
  }

  /**
   * Get parent department for a department
   */
  getParentDepartment(id: string): Department | undefined {
    const dept = this.getDepartmentById(id);
    
    if (!dept?.parentId) return undefined;
    
    return this.getDepartmentById(dept.parentId);
  }

  /**
   * Check if a department has sub-units
   */
  hasSubUnits(id: string): boolean {
    const dept = this.getDepartmentById(id);
    return !!dept?.subUnits && dept.subUnits.length > 0;
  }

  /**
   * Get all parent departments (top-level departments)
   */
  getParentDepartments(): Department[] {
    return DEPARTMENTS;
  }

  /**
   * Get child departments for a given parent department
   */
  getChildDepartments(parentId: string): Department[] {
    const dept = this.getDepartmentById(parentId);
    return dept?.subUnits ?? [];
  }
}

// Export as a singleton
export const departmentService = new DepartmentService();