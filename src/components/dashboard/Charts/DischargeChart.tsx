// src/components/dashboard/Charts/DischargeChart.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DischargeData } from '@/components/dashboard/types';
import { departmentService } from '@/lib/services/departmentService';
import { AlertCircle } from 'lucide-react';
import { useWindowSize, getResponsiveBreakpoints } from '@/hooks/useWindowSize';

interface DischargeChartProps {
  data: DischargeData[];
  isLoading?: boolean;
}

// Custom tooltip component optimized for mobile
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480;
  
  // Get original department object from payload
  const departmentInfo = payload[0]?.payload;
  if (!departmentInfo) return null;
  
  const departmentName = departmentInfo.departmentName || departmentService.getDepartmentName(departmentInfo.department);
  
  // Format discharge types and values
  const dischargeTypes = [
    { name: 'Recovered', value: departmentInfo.recovered, color: '#4caf50' },
    { name: 'LAMA', value: departmentInfo.lama, color: '#ff9800' },
    { name: 'Absconded', value: departmentInfo.absconded, color: '#ffc107' },
    { name: 'Referred', value: departmentInfo.referred, color: '#2196f3' },
    { name: 'Not Improved', value: departmentInfo.notImproved, color: '#9c27b0' },
    { name: 'Deaths', value: departmentInfo.deaths, color: 'hsl(var(--destructive))' }
  ].filter(item => item.value > 0)
   .sort((a, b) => b.value - a.value);
  
  const total = departmentInfo.total || dischargeTypes.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-background border rounded-md shadow-md p-2 sm:p-3 max-w-[90vw] sm:max-w-[300px]">
      <p className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">
        {departmentName}
        <span className="ml-1 font-normal text-muted-foreground">
          (Total: {total})
        </span>
      </p>
      <div className="space-y-1">
        {dischargeTypes.map((type, index) => (
          <div 
            key={`item-${index}`} 
            className="flex items-center gap-1 sm:gap-2"
            style={{ 
              padding: isMobile ? '3px 0' : '2px 0',
              borderBottom: index < dischargeTypes.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}
          >
            <div 
              className={`${isMobile ? 'w-3 h-3' : 'w-2 h-2'} rounded-full flex-shrink-0`}
              style={{ backgroundColor: type.color }}
            />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium truncate max-w-[105px] sm:max-w-[120px]`}>
              {type.name}:
            </span>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold ml-auto`}>
              {type.value.toLocaleString()}
            </span>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ml-1 sm:ml-2`}>
              ({Math.round((type.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Chart displaying discharge statistics by department
 * 
 * Shows discharge statistics broken down by reason (recovered, lama, etc.)
 * for each department as a stacked bar chart.
 */
export function DischargeChart({ data, isLoading }: DischargeChartProps) {
  const windowSize = useWindowSize();
  const { isXs, isMd, isVerySmall } = getResponsiveBreakpoints(windowSize.width);
  
  // Handle loading state
  if (isLoading) {
    return (
      <Card className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Discharge Analysis</h3>
        <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-b-2 rounded-full mx-auto mb-2"></div>
            <p className="text-xs sm:text-sm text-muted-foreground">Loading discharge data...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Discharge Analysis</h3>
        <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">No discharge data available</p>
          </div>
        </div>
      </Card>
    );
  }

  // Calculate total discharges for each department for data processing
  const processedData = data.map(dept => {
    const total = 
      dept.recovered + 
      dept.lama + 
      dept.absconded + 
      dept.referred + 
      dept.notImproved + 
      dept.deaths;
      
    return {
      ...dept,
      departmentName: departmentService.getDepartmentName(dept.department),
      total
    };
  });

  // Sort by total discharges (highest first)
  const sortedData = [...processedData].sort((a, b) => b.total - a.total);
  
  // For mobile view, limit the number of departments shown
  const visibleData = isXs && sortedData.length > 4 
    ? sortedData.slice(0, 4) 
    : sortedData;
  
  // Format department names for X-axis, abbreviated on mobile
  const formatDepartmentName = (name: string): string => {
    if (isVerySmall) {
      // First letter of each word, or first 3 letters
      const initials = name.split(' ').map(w => w.charAt(0)).join('');
      return initials || name.substring(0, 3);
    }
    else if (isXs) {
      // Truncate to first word or first 6 chars
      const firstWord = name.split(' ')[0] || '';
      return firstWord.length < 6 ? firstWord : name.substring(0, 6);
    }
    
    return name;
  };
  
  // Function to format numbers in tooltip
  const formatNumber = (value: number) => {
    return isXs ? value.toString() : value.toLocaleString();
  };

  // Colors for different discharge reasons
  const dischargeColors = {
    recovered: "#4caf50",
    lama: "#ff9800",
    absconded: "#ffc107",
    referred: "#2196f3",
    notImproved: "#9c27b0",
    deaths: "hsl(var(--destructive))"
  };

  return (
    <Card className="p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4" id="discharge-chart-title">
        Discharge Analysis
      </h3>
      {isXs && sortedData.length > 4 && (
        <p className="text-xs text-muted-foreground mb-2">
          Showing top 4 of {sortedData.length} departments
        </p>
      )}
      <div 
        className="h-[300px] sm:h-[400px]" 
        role="figure" 
        aria-labelledby="discharge-chart-title"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={visibleData}
            margin={{ 
              top: 5, 
              right: isXs ? 5 : 30, 
              left: isXs ? 5 : 20, 
              bottom: isVerySmall ? 70 : isXs ? 50 : 70 
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={!isXs}
            />
            <XAxis 
              dataKey="departmentName"
              tickFormatter={formatDepartmentName}
              angle={isVerySmall ? -45 : isXs ? -30 : -45}
              textAnchor="end"
              height={isVerySmall ? 70 : isXs ? 50 : 70}
              tick={{ fontSize: isXs ? 10 : 12 }}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: isXs ? 10 : 12 }}
              tickFormatter={formatNumber}
              width={isXs ? 25 : 40}
              // Hide grid lines on small screens
              axisLine={!isXs}
              tickLine={!isXs}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            {/* Mobile-optimized legend */}
            <Legend 
              verticalAlign="top" 
              height={isXs ? 0 : 36}
              wrapperStyle={{ 
                fontSize: '12px', 
                display: isXs ? 'none' : 'block' 
              }}
            />
            <Bar 
              dataKey="recovered" 
              stackId="discharges"
              fill={dischargeColors.recovered}
              name="Recovered" 
            />
            <Bar 
              dataKey="lama" 
              stackId="discharges"
              fill={dischargeColors.lama}
              name="LAMA" 
            />
            <Bar 
              dataKey="absconded" 
              stackId="discharges"
              fill={dischargeColors.absconded}
              name="Absconded" 
            />
            <Bar 
              dataKey="referred" 
              stackId="discharges"
              fill={dischargeColors.referred} 
              name="Referred" 
            />
            <Bar 
              dataKey="notImproved" 
              stackId="discharges"
              fill={dischargeColors.notImproved} 
              name="Not Improved" 
            />
            <Bar 
              dataKey="deaths" 
              stackId="discharges"
              fill={dischargeColors.deaths} 
              name="Deaths" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Mobile legend for discharge types */}
      {isXs && (
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {[
            { key: 'recovered', name: 'Recovered' },
            { key: 'lama', name: 'LAMA' },
            { key: 'absconded', name: 'Absconded' },
            { key: 'referred', name: 'Referred' },
            { key: 'notImproved', name: 'Not Improved' },
            { key: 'deaths', name: 'Deaths' }
          ].map((type) => (
            <div key={type.key} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: dischargeColors[type.key as keyof typeof dischargeColors] }}
              />
              <span className="text-xs">{type.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}