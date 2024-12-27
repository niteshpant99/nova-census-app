// src/components/dashboard/Charts/OccupancyChart.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DepartmentOccupancy } from '../types';

interface OccupancyChartProps {
  data: DepartmentOccupancy[];
  isLoading?: boolean;
}

export function OccupancyChart({ data, isLoading }: OccupancyChartProps) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="h-[300px] flex items-center justify-center">
          Loading...
        </div>
      </Card>
    );
  }

  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Department Occupancy</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} unit="%" />
            <YAxis type="category" dataKey="department" />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Occupancy']}
              labelFormatter={(label) => `${label} (${data.find(d => d.department === label)?.current}/${data.find(d => d.department === label)?.total})`}
            />
            <Bar dataKey="percentage" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}