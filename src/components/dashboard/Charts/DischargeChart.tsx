// src/components/dashboard/Charts/DischargeChart.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DischargeData } from '../types';

interface DischargeChartProps {
  data: DischargeData[];
  isLoading?: boolean;
}

export function DischargeChart({ data, isLoading }: DischargeChartProps) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="h-[400px] flex items-center justify-center">
          Loading...
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Discharge Analysis</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="recovered" fill="hsl(var(--chart-1))" name="Recovered" />
            <Bar dataKey="lama" fill="hsl(var(--chart-2))" name="LAMA" />
            <Bar dataKey="absconded" fill="hsl(var(--chart-3))" name="Absconded" />
            <Bar dataKey="referred" fill="hsl(var(--chart-4))" name="Referred" />
            <Bar dataKey="notImproved" fill="hsl(var(--chart-5))" name="Not Improved" />
            <Bar dataKey="deaths" fill="hsl(var(--destructive))" name="Deaths" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}