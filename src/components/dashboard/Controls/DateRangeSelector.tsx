// src/components/dashboard/Controls/DateRangeSelector.tsx
import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCallback } from 'react';

interface DateRangeProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  className?: string;
}

export const DateRangeSelector = React.memo(function DateRangeSelector({ 
  date, 
  onDateChange, 
  className 
}: DateRangeProps) {
  const handleDateChange = useCallback(
    (date: DateRange | undefined) => {
      onDateChange(date);
    },
    [onDateChange]
  );
   // Add default range display formatting
   const dateDisplay = date?.from && date?.to 
   ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
   : "Select date range";

   return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateDisplay}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});