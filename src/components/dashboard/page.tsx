'use client';

import { useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { Card } from '@/components/ui/card';
import { 
  StatsGrid,
  HistoricalChart,
  OccupancyChart,
  DischargeChart,
  TrendsChart,
  DateRangeSelector,
  DepartmentFilter,
  MetricToggle,
  DEPARTMENTS,
  getAllDepartments
} from '@/components/dashboard';
import { useDashboardData } from '@/lib/hooks/useDashboardData';
import { DASHBOARD_METRICS } from '@/components/dashboard/Controls/MetricToggle';

export default function DashboardPage() {
  // State management
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
    getAllDepartments().map(d => d.id)
  );
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    DASHBOARD_METRICS.slice(0, 3).map(m => m.id) // Default to first 3 metrics
  );

  // Fetch dashboard data using our custom hook
  const {
    stats,
    occupancy,
    historical,
    discharges,
    isLoading
  } = useDashboardData(dateRange, selectedDepartments);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Nova Census Dashboard</h1>
        </div>
      </div>

      {/* Controls Section */}
      <div className="container mx-auto px-4 py-4">
        <Card className="p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DateRangeSelector
              date={dateRange}
              onDateChange={setDateRange}
              className="w-full"
            />
            <DepartmentFilter
              departments={DEPARTMENTS}
              selectedDepartments={selectedDepartments}
              onSelectionChange={setSelectedDepartments}
              className="w-full"
            />
            <MetricToggle
              metrics={DASHBOARD_METRICS}
              selectedMetrics={selectedMetrics}
              onSelectionChange={setSelectedMetrics}
              className="w-full"
            />
          </div>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-4 space-y-6">
        {/* Quick Stats Section */}
        {stats && <StatsGrid stats={stats} isLoading={isLoading} />}

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Historical Overview */}
          <Card className="col-span-2">
            <HistoricalChart
              data={historical ?? []}
              isLoading={isLoading}
            />
          </Card>

          {/* Department Occupancy */}
          <Card>
            <OccupancyChart
              data={occupancy ?? []}
              isLoading={isLoading}
            />
          </Card>

          {/* Discharge Analysis */}
          <Card>
            <DischargeChart
              data={discharges ?? []}
              isLoading={isLoading}
            />
          </Card>

          {/* Trends Analysis */}
          {selectedMetrics.length > 0 && (
            <Card className="col-span-2">
              <TrendsChart
                data={historical ?? []}
                metrics={selectedMetrics}
                isLoading={isLoading}
              />
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}