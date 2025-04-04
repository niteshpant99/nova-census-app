// src/components/dashboard/Charts/TrendsChart.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine 
} from 'recharts';
import type { ChartDataPoint } from '@/components/dashboard/types';
import { format, parseISO } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import type { TextProps } from 'recharts';
import { useWindowSize, getResponsiveBreakpoints } from '@/hooks/useWindowSize';

// Mapping between metric IDs and their corresponding data fields
const METRIC_DATA_KEYS: Record<string, keyof ChartDataPoint> = {
  'occupancy': 'occupancy_rate', 
  'admissions': 'admissions',
  'discharges': 'discharges',
  'ot_cases': 'ot_cases',
  'transfers': 'transfers' 
};

// Mapping metric IDs to more readable display names
const METRIC_DISPLAY_NAMES: Record<string, string> = {
  'occupancy': 'Occupancy Rate',
  'admissions': 'Admissions',
  'discharges': 'Discharges',
  'ot_cases': 'OT Cases',
  'transfers': 'Transfers'
};

/**
 * Custom tooltip for the TrendsChart
 * Mobile-optimized with larger touch targets and clearer text
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  const windowSize = useWindowSize();
  
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formattedDate = label ? format(parseISO(label), 'MMM d, yyyy') : '';
  const isMobile = windowSize.width < 480;

  // Sort entries by value for easier comparison on mobile
  const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
  
  return (
    <div className="bg-background border rounded-md shadow-md p-2 sm:p-3 max-w-[90vw] sm:max-w-[300px]">
      <p className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">{formattedDate}</p>
      <div className="space-y-1 sm:space-y-2">
        {sortedPayload.map((entry: any, index: number) => (
          <div 
            key={`item-${index}`} 
            className="flex items-center gap-1 sm:gap-2"
            // Larger touch target for the whole row
            style={{ 
              padding: isMobile ? '4px 0' : '2px 0',
              borderBottom: index < sortedPayload.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}
          >
            <div 
              // Larger color indicator on mobile
              className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} rounded-full flex-shrink-0`}
              style={{ backgroundColor: entry.color }}
            />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium truncate max-w-[100px] sm:max-w-[150px]`}>
              {entry.name}:
            </span>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold ml-auto`}>
              {typeof entry.value === 'number' ? entry.value.toFixed(0) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TrendsChartProps {
  data: ChartDataPoint[];
  metrics: string[];
  isLoading?: boolean;
}

/**
 * TrendsChart component
 * 
 * Displays multiple metrics over time for selected departments.
 * 
 * @param data - Time series data for the metrics
 * @param metrics - Array of metric IDs to display
 * @param isLoading - Whether data is currently loading
 */
// Custom tick component for the XAxis
const CustomXAxisTick = (props: any) => {
  const { x, y, payload, isSmallScreen } = props;
  if (!payload.value) return null;
  
  const dateStr = format(parseISO(payload.value.toString()), 'MMM d');
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={isSmallScreen ? 16 : 12} 
        textAnchor="middle"
        fill="#666"
        fontSize={isSmallScreen ? 10 : 12}
        transform={isSmallScreen ? "rotate(-45)" : ""}
      >
        {dateStr}
      </text>
    </g>
  );
};

export function TrendsChart({ data, metrics, isLoading }: TrendsChartProps) {
  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];
  const windowSize = useWindowSize();
  
  // Get responsive breakpoints
  const { isXs, isSm, isMd, isVerySmall } = getResponsiveBreakpoints(windowSize.width);

  // Handle loading state
  if (isLoading) {
    return (
      <Card className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Trends Analysis</h3>
        <div className="h-[250px] sm:h-[300px] md:h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-b-2 rounded-full mx-auto mb-2"></div>
            <p className="text-xs sm:text-sm text-muted-foreground">Loading trends data...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Trends Analysis</h3>
        <div className="h-[250px] sm:h-[300px] md:h-[400px] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">No data available for the selected period</p>
          </div>
        </div>
      </Card>
    );
  }

  // Process and format data for display
  const formattedData = data.map(item => {
    // Calculate any missing metrics based on available data
    const occupancy_rate = item.occupancy_rate ?? (item.current_patients / 100); // Approximation
    const transfers = item.transfers ?? (item.transfers_in ?? 0) + (item.transfers_out ?? 0);
    
    return {
      ...item,
      // Ensure all metrics have at least a fallback value
      admissions: item.admissions ?? 0,
      discharges: item.discharges ?? 0,
      ot_cases: item.ot_cases ?? 0,
      transfers,
      occupancy_rate,
      // Format date for display
      formattedDate: item.date ? format(parseISO(item.date), 'MMM d') : ''
    };
  });

  // For mobile screens, limit the number of reference lines to prevent clutter
  const showReferenceLines = isMd;

  return (
    <Card className="p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4" id="trends-chart-title">Trends Analysis</h3>
      
      {/* Mobile legend - display as pills on small screens */}
      <div className="flex flex-wrap gap-2 mb-2 md:hidden">
        {metrics.map((metric, index) => (
          <div 
            key={`mobile-legend-${metric}`}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs border"
            style={{ borderColor: colors[index % colors.length] }}
          >
            <div 
              className="w-2 h-2 rounded-full mr-1" 
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span>{METRIC_DISPLAY_NAMES[metric]}</span>
          </div>
        ))}
      </div>
      
      <div 
        className="h-[250px] sm:h-[300px] md:h-[400px]" 
        aria-labelledby="trends-chart-title"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ 
              top: 10, 
              right: 10, 
              left: 0, 
              bottom: 5,
              // Override left margin on larger screens
              ...(isMd ? { left: 20, right: 30 } : {})
            }}
            aria-label="Trends analysis chart showing multiple metrics over time"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={!isXs} />
            <XAxis 
              dataKey="date" 
              tick={<CustomXAxisTick isSmallScreen={isVerySmall} />}
              aria-label="Dates"
              // Reduce number of ticks on small screens
              interval={isXs ? 1 : 0}
              height={isVerySmall ? 40 : 30}
            />
            <YAxis 
              aria-label="Values" 
              tick={{ fontSize: isXs ? 10 : 12 }}
              // Hide the axis line on small screens to save space
              axisLine={!isXs}
              tickLine={!isXs}
              // Use fewer decimals on small screens
              tickFormatter={(value) => typeof value === 'number' ? value.toFixed(0) : value}
              width={isXs ? 30 : 40}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Only show legend on larger screens - we have mobile optimized legend above */}
            {isMd && <Legend />}
            
            {/* Add reference lines for the average of each metric - only on larger screens */}
            {showReferenceLines && data.length > 0 && metrics.length > 0 && metrics.map((metric, index) => {
              const dataKey = METRIC_DATA_KEYS[metric] || 'current_patients';
              // Calculate average for this metric
              const metricValues = formattedData.map(item => Number(item[dataKey]) || 0);
              const average = metricValues.reduce((sum, val) => sum + val, 0) / metricValues.length;
              
              if (isNaN(average) || average === 0) return null;
              
              return (
                <ReferenceLine 
                  key={`avg-${metric}`}
                  y={average} 
                  stroke={colors[index % colors.length]} 
                  strokeDasharray="3 3"
                  label={{ 
                    value: `Avg ${METRIC_DISPLAY_NAMES[metric]}`,
                    position: 'insideBottomRight',
                    fill: colors[index % colors.length],
                    fontSize: 10
                  }}
                />
              );
            })}
            
            {metrics.map((metric, index) => {
              const dataKey = METRIC_DATA_KEYS[metric] || 'current_patients';
              return (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={dataKey}
                  stroke={colors[index % colors.length]}
                  name={METRIC_DISPLAY_NAMES[metric] || metric}
                  // Larger touch targets for mobile
                  activeDot={{ r: isXs ? 8 : 6 }}
                  // Thicker lines on small screens for better visibility
                  strokeWidth={isXs ? 3 : 2}
                  // Connect null data points on mobile for better visibility
                  connectNulls={!isMd}
                  // Fewer dots on small screens to prevent clutter
                  dot={isXs ? { r: 0 } : { r: 3 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}