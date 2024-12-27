import { DEPARTMENTS } from '@/components/dashboard/config/departments';
import type { Department } from '@/components/dashboard/types';

class DepartmentService {
  private departments: Department[] = DEPARTMENTS;

  // Get all departments including sub-units
  getAllDepartments(): Department[] {
    return this.departments.reduce<Department[]>((all, dept) => {
      all.push(dept);
      if (dept.subUnits) {
        all.push(...dept.subUnits);
      }
      return all;
    }, []);
  }

  // Get department by ID
  getDepartment(id: string): Department | undefined {
    for (const dept of this.departments) {
      if (dept.id === id) return dept;
      if (dept.subUnits) {
        const subUnit = dept.subUnits.find(unit => unit.id === id);
        if (subUnit) return subUnit;
      }
    }
    return undefined;
  }

  // Get total beds for a department (including sub-units)
  getDepartmentTotalBeds(id: string): number {
    const dept = this.getDepartment(id);
    if (!dept) return 0;

    const mainBeds = dept.totalBeds;
    const subUnitBeds = dept.subUnits?.reduce((sum, unit) => sum + unit.totalBeds, 0) ?? 0;
    
    return mainBeds + subUnitBeds;
  }

  // Get total hospital beds
  getTotalHospitalBeds(): number {
    return this.departments.reduce((total, dept) => {
      const mainBeds = dept.totalBeds;
      const subUnitBeds = dept.subUnits?.reduce((sum, unit) => sum + unit.totalBeds, 0) ?? 0;
      return total + mainBeds + subUnitBeds;
    }, 0);
  }

  // Calculate occupancy rate for a department
  calculateDepartmentOccupancy(id: string, currentPatients: number): number {
    const totalBeds = this.getDepartmentTotalBeds(id);
    if (totalBeds === 0) return 0;
    return (currentPatients / totalBeds) * 100;
  }

  // Get parent department if exists
  getParentDepartment(id: string): Department | undefined {
    return this.departments.find(dept => 
      dept.subUnits?.some(unit => unit.id === id)
    );
  }

  // Check if department exists
  isDepartmentValid(id: string): boolean {
    return !!this.getDepartment(id);
  }
}

// Export singleton instance
export const departmentService = new DepartmentService();