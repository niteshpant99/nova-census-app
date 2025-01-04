// src/compoents/dashboard/config/department.ts

import type { Department } from '@/components/dashboard/types';

// TODO: In future versions, consolidate department types and handling
{/*
  Post op:10
Cabin:3
General ward:18
ICU:5
Pediatric ward:9
NICU:8
Maternal ward:7
There are altogether 60 beds including cabin.
*/}

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
    name: 'Material Ward',
    totalBeds: 7,
  }
];

// Helper functions
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

export const getTotalHospitalBeds = (): number => {
  return DEPARTMENTS.reduce((total, dept) => {
    const mainBeds = dept.totalBeds;
    const subUnitBeds = dept.subUnits?.reduce((sum, unit) => sum + unit.totalBeds, 0) ?? 0;
    return total + mainBeds + subUnitBeds;
  }, 0);
};

export const isValidDepartment = (id: string): boolean => {
  return DEPARTMENTS.some(dept => 
    dept.id === id || dept.subUnits?.some(unit => unit.id === id)
  );
};

// Get flattened list of all departments including sub-units
export const getAllDepartments = (): Department[] => {
  return DEPARTMENTS.reduce<Department[]>((all, dept) => {
    all.push(dept);
    if (dept.subUnits) {
      all.push(...dept.subUnits);
    }
    return all;
  }, []);
};