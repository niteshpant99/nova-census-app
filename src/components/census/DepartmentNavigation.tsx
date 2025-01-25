// src/components/census/DepartmentNavigation.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CensusNavigationState, useCensusNavigation } from "@/hooks/useCensusNavigation";

interface DepartmentNavigationProps {
    navigation: Omit<CensusNavigationState, 'goToNext' | 'goToPrevious'>;
    onNext: () => void;
    onPrevious: () => void;
    isLoading?: boolean;
  }


export function DepartmentNavigation({ 
  navigation, 
  onNext, 
  onPrevious, 
  isLoading 
}: DepartmentNavigationProps) {
  const {
    currentIndex,
    totalDepartments,
    hasNext,
    hasPrevious,
    nextDepartment,
    previousDepartment,
  } = navigation;

  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:static md:shadow-none">
      <div className="container max-w-md mx-auto">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!hasPrevious || isLoading}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {previousDepartment?.name ?? 'Previous'}
          </Button>

          <div className="text-sm text-muted-foreground whitespace-nowrap px-2">
            {currentIndex + 1} of {totalDepartments}
          </div>

          <Button
            variant="outline"
            onClick={onNext}
            disabled={!hasNext || isLoading}
            className="flex-1"
          >
            {nextDepartment?.name ?? 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
}