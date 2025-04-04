// src/lib/config/departments.ts

import type { Department } from '@/types/department';

/**
 * Department configuration for Nova Hospital
 * This is the single source of truth for department data in the application
 */
export const DEPARTMENTS: Department[] = [
  {
    id: 'general',
    name: 'General Ward',
    totalBeds: 18,
  },
  {
    id: 'post-op',
    name: 'Post Op',
    totalBeds: 10,
    subUnits: [
      {
        id: 'cabin',
        name: 'Cabin',
        totalBeds: 3,
        parentId: 'post-op'
      }
    ]
  },
  {
    id: 'pediatric',
    name: 'Pediatric Ward',
    totalBeds: 9,
  },
  {
    id: 'nicu',
    name: 'NICU',
    totalBeds: 8,
  },
  {
    id: 'icu',
    name: 'ICU',
    totalBeds: 5,
  },
  {
    id: 'maternal',
    name: 'Maternal Ward', // Fixed typo from "Material Ward"
    totalBeds: 7,
  }
];

/**
 * Retrieve a department by its ID
 */
export const getDepartmentById = (id: string): Department | undefined => {
  for (const dept of DEPARTMENTS) {
    if (dept.id === id) return dept;
    if (dept.subUnits) {
      const subUnit = dept.subUnits.find(unit => unit.id === id);
      if (subUnit) return subUnit;
    }
  }
  return undefined;
};

/**
 * Calculate the total number of beds in the hospital
 */
export const getTotalHospitalBeds = (): number => {
  return DEPARTMENTS.reduce((total, dept) => {
    const mainBeds = dept.totalBeds;
    const subUnitBeds = dept.subUnits?.reduce((sum, unit) => sum + unit.totalBeds, 0) ?? 0;
    return total + mainBeds + subUnitBeds;
  }, 0);
};

/**
 * Check if a department ID is valid
 */
export const isValidDepartment = (id: string): boolean => {
  return DEPARTMENTS.some(dept => 
    dept.id === id || dept.subUnits?.some(unit => unit.id === id)
  );
};

/**
 * Get a flattened list of all departments including sub-units
 */
export const getAllDepartments = (): Department[] => {
  return DEPARTMENTS.reduce<Department[]>((all, dept) => {
    all.push(dept);
    if (dept.subUnits) {
      all.push(...dept.subUnits);
    }
    return all;
  }, []);
};

/**
 * Get a list of all department IDs
 */
export const getAllDepartmentIds = (): string[] => {
  return getAllDepartments().map(dept => dept.id);
};

/**
 * Get a list of all parent departments (excluding sub-units)
 */
export const getParentDepartments = (): Department[] => {
  return DEPARTMENTS.filter(dept => !dept.parentId);
};

/**
 * Get child departments for a given parent department ID
 */
export const getChildDepartments = (parentId: string): Department[] => {
  const parent = getDepartmentById(parentId);
  return parent?.subUnits ?? [];
};