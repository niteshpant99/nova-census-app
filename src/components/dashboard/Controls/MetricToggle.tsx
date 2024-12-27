// src/components/dashboard/Controls/MetricToggle.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export interface Metric {
  id: string;
  name: string;
  description?: string;
}

interface MetricToggleProps {
  metrics: Metric[];
  selectedMetrics: string[];
  onSelectionChange: (metrics: string[]) => void;
  className?: string;
}

export function MetricToggle({
  metrics,
  selectedMetrics,
  onSelectionChange,
  className,
}: MetricToggleProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium leading-none">Metrics</label>
      <ToggleGroup
        type="multiple"
        className="flex flex-wrap gap-2 justify-start"
        value={selectedMetrics}
        onValueChange={onSelectionChange}
      >
        {metrics.map((metric) => (
          <ToggleGroupItem
            key={metric.id}
            value={metric.id}
            aria-label={`Toggle ${metric.name}`}
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <span className="text-sm">{metric.name}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

// Predefined metrics for the dashboard
export const DASHBOARD_METRICS: Metric[] = [
  { id: 'occupancy', name: 'Occupancy Rate' },
  { id: 'admissions', name: 'Admissions' },
  { id: 'discharges', name: 'Discharges' },
  { id: 'ot_cases', name: 'OT Cases' },
  { id: 'transfers', name: 'Transfers' }
];