// src/hooks/useCensusNavigation.ts
import { useRouter } from 'next/navigation';
import { getAllDepartments } from '@/components/dashboard/config/departments';
import { useCallback } from 'react';

interface UseCensusNavigationProps {
  currentDepartment: string;
  onNavigate?: (nextDepartment: string) => Promise<boolean> | boolean;
}

interface Department {
    id: string;
    name: string;
    totalBeds: number;
    parentId?: string;
    subUnits?: Department[];
  }

export interface CensusNavigationState {
    currentIndex: number;
    totalDepartments: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextDepartment: Department | null;
    previousDepartment: Department | null;
    goToNext: () => Promise<void>;
    goToPrevious: () => Promise<void>;
  }


export function useCensusNavigation({ 
    currentDepartment,
    onNavigate 
  }: UseCensusNavigationProps): CensusNavigationState {
  const router = useRouter();
  const departments = getAllDepartments();
  
  const currentIndex = departments.findIndex(d => d.id === currentDepartment);
  
  const getNextDepartment = useCallback(() => {
    if (currentIndex < departments.length - 1) {
      return departments[currentIndex + 1];
    }
    return null;
  }, [currentIndex, departments]);
  
  const getPreviousDepartment = useCallback(() => {
    if (currentIndex > 0) {
      return departments[currentIndex - 1];
    }
    return null;
  }, [currentIndex, departments]);
  
  const navigate = useCallback(async (departmentId: string) => {
    // If there's a navigation handler, call it first
    if (onNavigate) {
      const canNavigate = await onNavigate(departmentId);
      if (!canNavigate) return;
    }
    
    router.push(`/census/${departmentId}`);
  }, [onNavigate, router]);
  
  const goToNext = useCallback(async () => {
    const nextDept = getNextDepartment();
    if (nextDept) {
      await navigate(nextDept.id);
    }
  }, [getNextDepartment, navigate]);
  
  const goToPrevious = useCallback(async () => {
    const prevDept = getPreviousDepartment();
    if (prevDept) {
      await navigate(prevDept.id);
    }
  }, [getPreviousDepartment, navigate]);
  
  return {
    currentIndex,
    totalDepartments: departments.length,
    hasNext: currentIndex < departments.length - 1,
    hasPrevious: currentIndex > 0,
    nextDepartment: getNextDepartment() ?? null,
    previousDepartment: getPreviousDepartment() ?? null,
    goToNext,
    goToPrevious,
  };
}