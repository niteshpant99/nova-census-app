// src/components/dashboard/Charts/HistoricalChart.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { ChartDataPoint } from '@/components/dashboard/types';

interface HistoricalChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

export function HistoricalChart({ data, isLoading }: HistoricalChartProps) {
  // Type-safe formatting functions
  const formatXAxisDate = (dateStr: string): string => {
    // Validate date string
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return 'Invalid Date';
    }

    try {
      const date = new Date(dateStr);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatTooltipDate = (dateStr: string): string => {
    // Validate date string
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return 'Invalid Date';
    }

    try {
      const date = new Date(dateStr);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting tooltip date:', error);
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="h-[300px] flex items-center justify-center">
          Loading...
        </div>
      </Card>
    );
  }

  // Validate data
  if (!Array.isArray(data)) {
    console.error('Invalid data provided to HistoricalChart:', data);
    return null;
  }

  // Log the actual values being used
  console.log('First data point:', data[0]);
  console.log('Sample formatted date:', data[0]?.date ? formatXAxisDate(data[0].date) : 'No date');

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Daily Patient Census</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tickFormatter={formatXAxisDate}
            />
            <YAxis 
              allowDecimals={false}
              min={0}
            />
            <Tooltip
              formatter={(value: number) => [`${value} patients`, 'Total Patients']}
              labelFormatter={formatTooltipDate}
            />
              <Bar
                dataKey="current_patients"
                fill="hsl(var(--primary))"
                name="Total Patients"
                radius={[4, 4, 0, 0]}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value} patients`,
                  'Total Patients'
                ]}
                labelFormatter={formatTooltipDate}
              />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}