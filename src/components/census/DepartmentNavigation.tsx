// src/components/census/DepartmentNavigation.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Department } from "@/types/department";

interface DepartmentNavigationProps {
  currentIndex: number;
  totalDepartments: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextDepartment: Department | null | undefined;
  previousDepartment: Department | null | undefined;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

/**
 * Navigation component for census entry workflow
 * 
 * Provides backward and forward navigation controls,
 * along with progress indication for the census entry process.
 */
export function DepartmentNavigation({ 
  currentIndex,
  totalDepartments,
  hasNext,
  hasPrevious,
  nextDepartment,
  previousDepartment,
  onNext, 
  onPrevious, 
  isLoading 
}: DepartmentNavigationProps) {
  // Calculate progress percentage
  const progressPercentage = Math.round(((currentIndex + 1) / totalDepartments) * 100);

  return (
    <>
      {/* Progress bar */}
      <div className="h-1 bg-gray-100 w-full mb-2">
        <div 
          className="h-full bg-primary" 
          style={{ width: `${progressPercentage}%` }}
          aria-label={`Progress: ${progressPercentage}%`}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Navigation controls */}
      <Card className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:static md:shadow-none">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!hasPrevious || isLoading}
              className="flex-1"
              aria-label={`Go to previous department: ${previousDepartment?.name ?? 'None'}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="truncate max-w-[100px]">
                {previousDepartment?.name ?? 'Previous'}
              </span>
            </Button>

            <div 
              className="text-sm text-muted-foreground whitespace-nowrap px-2"
              aria-live="polite"
            >
              {currentIndex + 1} of {totalDepartments}
            </div>

            <Button
              variant="outline"
              onClick={onNext}
              disabled={!hasNext || isLoading}
              className="flex-1"
              aria-label={`Go to next department: ${nextDepartment?.name ?? 'None'}`}
            >
              <span className="truncate max-w-[100px]">
                {nextDepartment?.name ?? 'Next'}
              </span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}