// src/hooks/useCensusNavigation.ts
import { useRouter } from 'next/navigation';
import { getAllDepartments } from '@/lib/config/departments';
import { useCallback, useState, useEffect } from 'react';
import type { Department } from '@/types/department';

interface UseCensusNavigationProps {
  currentDepartment: string;
  onNavigate?: (nextDepartment: string) => Promise<boolean> | boolean;
}

/**
 * Hook to manage department navigation in the census entry flow
 * 
 * Provides methods and state for navigating between departments,
 * including determining the next/previous departments and handling
 * navigation with optional validation.
 */
export function useCensusNavigation({ 
  currentDepartment,
  onNavigate 
}: UseCensusNavigationProps) {
  const router = useRouter();
  const departments = getAllDepartments();
  
  // State for navigation
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [nextDepartment, setNextDepartment] = useState<Department | null | undefined>(null);
  const [previousDepartment, setPreviousDepartment] = useState<Department | null | undefined>(null);
  
  // Update state when currentDepartment changes
  useEffect(() => {
    const idx = departments.findIndex(d => d.id === currentDepartment);
    setCurrentIndex(idx);
    
    // Set next department if available
    if (idx >= 0 && idx < departments.length - 1) {
      setNextDepartment(departments[idx + 1]);
    } else {
      setNextDepartment(null);
    }
    
    // Set previous department if available
    if (idx > 0 && idx < departments.length) {
      setPreviousDepartment(departments[idx - 1]);
    } else {
      setPreviousDepartment(null);
    }
  }, [currentDepartment, departments]);
  
  // Determine if we can navigate
  const hasNext = currentIndex >= 0 && currentIndex < departments.length - 1;
  const hasPrevious = currentIndex > 0;
  
  // Navigate to a department, with optional validation
  const navigate = useCallback(async (departmentId: string) => {
    // If there's a navigation handler, call it first
    if (onNavigate) {
      const canNavigate = await onNavigate(departmentId);
      if (!canNavigate) return; // Abort navigation if validation fails
    }
    
    // Navigate to the target department
    router.push(`/census/${encodeURIComponent(departmentId)}`);
  }, [onNavigate, router]);
  
  // Navigate to the next department
  const goToNext = useCallback(async () => {
    if (nextDepartment) {
      await navigate(nextDepartment.id);
    }
  }, [nextDepartment, navigate]);
  
  // Navigate to the previous department
  const goToPrevious = useCallback(async () => {
    if (previousDepartment) {
      await navigate(previousDepartment.id);
    }
  }, [previousDepartment, navigate]);
  
  // Return combined state and navigation methods
  return {
    currentIndex,
    totalDepartments: departments.length,
    hasNext,
    hasPrevious,
    nextDepartment,
    previousDepartment,
    goToNext,
    goToPrevious,
  };
}