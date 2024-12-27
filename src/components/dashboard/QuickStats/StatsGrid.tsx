// src/components/dashboard/QuickStats/StatsGrid.tsx

import { type DashboardStats } from '../types';
import { StatsCard } from './StatsCard';
import { Activity, Users, ArrowRightLeft, Percent } from 'lucide-react';

interface StatsGridProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

export function StatsGrid({ stats, isLoading = false }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Patients"
        value={isLoading ? "..." : stats.totalPatients}
        icon={<Users className="h-4 w-4" />}
      />
      
      <StatsCard
        title="OT Cases"
        value={isLoading ? "..." : stats.otCases}
        icon={<Activity className="h-4 w-4" />}
      />
      
      <StatsCard
        title="Patient Flow"
        value={isLoading ? "..." : `${stats.patientFlow.in} in / ${stats.patientFlow.out} out`}
        icon={<ArrowRightLeft className="h-4 w-4" />}
      />
      
      <StatsCard
        title="Occupancy Rate"
        value={isLoading ? "..." : `${stats.occupancyRate}%`}
        icon={<Percent className="h-4 w-4" />}
      />
    </div>
  );
}