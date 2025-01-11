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
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="h-[300px] flex items-center justify-center">
          Loading...
        </div>
      </Card>
    );
  }

  // Type-safe formatting functions
  const formatXAxisDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Daily Patient Census</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisDate}
            />
            <YAxis 
              domain={[0, 'auto']}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} patients`, 'Total Patients']}
              labelFormatter={formatTooltipDate}
            />
            <Bar 
              dataKey="value"
              fill="hsl(var(--primary))" 
              name="Total Patients"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}