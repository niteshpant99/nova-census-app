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
  // Add error boundary protection
  if (!Array.isArray(data)) {
    console.error('Invalid data provided to HistoricalChart:', data);
    return null;
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="h-[300px] flex items-center justify-center">
          Loading...
        </div>
      </Card>
    );
  }

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
              tickFormatter={(dateStr) => {
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <YAxis 
              allowDecimals={false}
              min={0}
            />
            <Tooltip
              formatter={(value: number) => [`${value} patients`, 'Total Patients']}
              labelFormatter={(dateStr) => {
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              }}
            />
            <Bar 
              dataKey="value"
              fill="hsl(var(--primary))"
              name="Total Patients"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}