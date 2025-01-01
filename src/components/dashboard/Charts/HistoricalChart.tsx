// src/components/dashboard/Charts/HistoricalChart.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Patient Distribution (Last 7 Days)</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="hsl(var(--primary))" name="Patients" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}