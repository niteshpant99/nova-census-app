// src/components/dashboard/Charts/HistoricalChart.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import type { ChartDataPoint } from '@/components/dashboard/types';
import { AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useWindowSize, getResponsiveBreakpoints } from '@/hooks/useWindowSize';

interface HistoricalChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

// Custom tooltip component for better mobile experience
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480;
  let dateStr = '';
  
  try {
    if (label && /^\d{4}-\d{2}-\d{2}$/.test(label)) {
      const date = parseISO(label);
      dateStr = format(date, 'EEEE, MMMM d, yyyy');
    } else {
      dateStr = label || '';
    }
  } catch (e) {
    dateStr = label || '';
  }

  return (
    <div className="bg-background border rounded-md shadow-md p-2 sm:p-3 max-w-[90vw] sm:max-w-[300px]">
      <p className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">{dateStr}</p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div 
            key={`item-${index}`} 
            className="flex items-center gap-1 sm:gap-2"
            style={{ padding: isMobile ? '4px 0' : '2px 0' }}
          >
            <div 
              className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} rounded-full`}
              style={{ backgroundColor: entry.fill }}
            />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
              {entry.name}:
            </span>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold ml-auto`}>
              {typeof entry.value === 'number' 
                ? entry.value.toLocaleString() + ' patients'
                : entry.value
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Chart displaying historical patient census data
 * 
 * Shows the total patient count across all departments
 * as a bar chart over time.
 */
export function HistoricalChart({ data, isLoading }: HistoricalChartProps) {
  const windowSize = useWindowSize();
  const { isXs, isSm, isMd, isVerySmall } = getResponsiveBreakpoints(windowSize.width);
  
  // Format dates for X-axis labels
  const formatXAxisDate = (dateStr: string): string => {
    try {
      return format(parseISO(dateStr), isVerySmall ? 'd/M' : 'MMM d');
    } catch (error) {
      return 'Invalid';
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Card className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Daily Patient Census</h3>
        <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-b-2 rounded-full mx-auto mb-2"></div>
            <p className="text-xs sm:text-sm text-muted-foreground">Loading historical data...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Handle empty data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Daily Patient Census</h3>
        <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">No historical data available</p>
          </div>
        </div>
      </Card>
    );
  }

  // Calculate average patient count for reference line
  const averagePatients = data.reduce((sum, item) => sum + item.current_patients, 0) / data.length;

  return (
    <Card className="p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4" id="historical-chart-title">
        Daily Patient Census
      </h3>
      <div 
        className="h-[250px] sm:h-[300px]" 
        role="figure" 
        aria-labelledby="historical-chart-title"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ 
              top: 10, 
              right: isXs ? 5 : 30, 
              left: isXs ? 0 : 5, 
              bottom: isVerySmall ? 60 : isXs ? 40 : 20 
            }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={!isXs} 
              horizontal={true}
            />
            <XAxis 
              dataKey="date"
              tickFormatter={formatXAxisDate}
              angle={isVerySmall ? -45 : isXs ? -30 : 0}
              textAnchor={isXs ? "end" : "middle"}
              height={isVerySmall ? 60 : isXs ? 40 : 30}
              tick={{ fontSize: isXs ? 10 : 12 }}
              interval={isXs ? 1 : 0}
              axisLine={!isXs}
              tickLine={!isXs}
            />
            <YAxis 
              allowDecimals={false}
              min={0}
              tick={{ fontSize: isXs ? 10 : 12 }}
              tickFormatter={(value) => 
                isXs ? value.toString() : value.toLocaleString()
              }
              width={isXs ? 25 : 35}
              axisLine={!isXs}
              tickLine={!isXs}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            {!isXs && (
              <ReferenceLine 
                y={averagePatients} 
                stroke="#666"
                strokeDasharray="3 3"
                label={{ 
                  value: `Avg: ${Math.round(averagePatients)}`, 
                  position: 'insideBottomRight',
                  fill: '#666',
                  fontSize: isXs ? 10 : 12
                }}
              />
            )}
            <Bar
              dataKey="current_patients"
              fill="hsl(var(--primary))"
              name="Total Patients"
              radius={[4, 4, 0, 0]}
              // Larger touch target on mobile
              onClick={isXs ? (data) => {
                // Handle bar click if needed
              } : undefined}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}