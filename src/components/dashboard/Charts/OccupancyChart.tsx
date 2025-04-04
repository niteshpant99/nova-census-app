// src/components/dashboard/Charts/OccupancyChart.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DepartmentOccupancy } from '@/components/dashboard/types';
import { departmentService } from '@/lib/services/departmentService';
import { AlertCircle } from 'lucide-react';
import { useWindowSize, getResponsiveBreakpoints } from '@/hooks/useWindowSize';

interface OccupancyChartProps {
  data: DepartmentOccupancy[];
  isLoading?: boolean;
}

// Custom tooltip component for better mobile experience
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480;
  const departmentInfo = payload[0]?.payload;
  
  if (!departmentInfo) return null;
  
  const departmentName = departmentService.getDepartmentName(departmentInfo.department);
  const percent = departmentInfo.percentage;
  const bedsInfo = `${departmentInfo.current}/${departmentInfo.total} beds`;
  
  return (
    <div className="bg-background border rounded-md shadow-md p-2 sm:p-3 max-w-[90vw] sm:max-w-[300px]">
      <p className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">{departmentName}</p>
      <div className="space-y-1">
        <div 
          className="flex items-center gap-1 sm:gap-2 border-b pb-1 mb-1"
          style={{ padding: isMobile ? '4px 0' : '2px 0' }}
        >
          <div 
            className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} rounded-full`}
            style={{ backgroundColor: 
              percent > 90 ? 'hsl(var(--destructive))' : 
              percent > 75 ? 'hsl(var(--warning))' : 
              'hsl(var(--primary))' 
            }}
          />
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
            Occupancy:
          </span>
          <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold ml-auto`}>
            {percent}%
          </span>
        </div>
        <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
          {bedsInfo}
        </div>
      </div>
    </div>
  );
};

/**
 * Chart displaying department occupancy rates
 * 
 * Shows the percentage of beds occupied in each department
 * as a horizontal bar chart, sorted by occupancy percentage.
 */
export function OccupancyChart({ data, isLoading }: OccupancyChartProps) {
  const windowSize = useWindowSize();
  const { isXs, isMd, isVerySmall } = getResponsiveBreakpoints(windowSize.width);
  
  // Handle loading state
  if (isLoading) {
    return (
      <Card className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Department Occupancy</h3>
        <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-b-2 rounded-full mx-auto mb-2"></div>
            <p className="text-xs sm:text-sm text-muted-foreground">Loading occupancy data...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Department Occupancy</h3>
        <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">No occupancy data available</p>
          </div>
        </div>
      </Card>
    );
  }

  // Sort data by occupancy percentage (highest first)
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);
  
  // Calculate color based on occupancy percentage
  const getBarColor = (percentage: number) => {
    if (percentage > 90) return 'hsl(var(--destructive))';
    if (percentage > 75) return 'hsl(var(--warning))';
    return 'hsl(var(--primary))';
  };
  
  // Format department names using the service, abbreviate for mobile
  const formatDepartmentName = (id: string): string => {
    const fullName = departmentService.getDepartmentName(id) || id;
    
    // On very small screens, abbreviate names further
    if (isVerySmall) {
      // First letter of each word, or first 3 letters
      const initials = fullName.split(' ').map(w => w.charAt(0)).join('');
      return initials || fullName.substring(0, 3);
    }
    // On small screens, abbreviate names
    else if (isXs) {
      // Truncate to first word or first 6 chars
      const firstWord = fullName.split(' ')[0] || '';
      return firstWord.length < 6 ? firstWord : fullName.substring(0, 6);
    }
    
    return fullName;
  };

  return (
    <Card className="p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4" id="occupancy-chart-title">
        Department Occupancy
      </h3>
      <div 
        className="h-[250px] sm:h-[300px]" 
        role="figure" 
        aria-labelledby="occupancy-chart-title"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={sortedData}
            layout="vertical"
            margin={{ 
              top: 5, 
              right: isXs ? 5 : 30, 
              left: isVerySmall ? 35 : isXs ? 60 : 80, 
              bottom: 5 
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={true}
              vertical={!isXs}
            />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              unit="%" 
              tick={{ fontSize: isXs ? 10 : 12 }}
              tickCount={isXs ? 3 : 5}
              axisLine={!isXs}
              tickLine={!isXs}
            />
            <YAxis 
              type="category" 
              dataKey="department" 
              width={isVerySmall ? 30 : isXs ? 55 : 80}
              tick={{ fontSize: isXs ? 10 : 12 }}
              tickFormatter={formatDepartmentName}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="percentage" 
              name="Occupancy Rate"
              radius={[0, 4, 4, 0]}
              // Increased click target area for touch interaction
              minPointSize={isXs ? 12 : 6}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.percentage)} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend for mobile - especially if department names are abbreviated */}
      {isXs && (
        <div className="mt-2 text-xs text-muted-foreground">
          <div className="flex gap-3 flex-wrap">
            {sortedData.slice(0, 3).map((dept, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="whitespace-nowrap">
                  {formatDepartmentName(dept.department)}:
                </span>
                <span className="font-medium">
                  {departmentService.getDepartmentName(dept.department)}
                </span>
              </div>
            ))}
            {sortedData.length > 3 && (
              <span className="text-xs">+{sortedData.length - 3} more</span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}