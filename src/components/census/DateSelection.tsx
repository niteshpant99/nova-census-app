// src/components/census/DateSection.tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import type { UseFormReturn } from 'react-hook-form';
import type { CensusFormData } from '@/lib/schemas/census';

interface DateSectionProps {
  form: UseFormReturn<CensusFormData>;
  showCalendar: boolean;
  onToggleCalendar: () => void;
}

export function DateSection({
  form,
  showCalendar,
  onToggleCalendar,
}: DateSectionProps) {
  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-background shadow-sm hover:bg-gray-50"
        onClick={onToggleCalendar}
      >
        {new Date(form.getValues("date")).toLocaleDateString()}
      </Button>

      {showCalendar && (
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={new Date(form.getValues("date"))}
            onSelect={(date) => {
              if (date) {
                form.setValue("date", format(date, 'yyyy-MM-dd'));
                onToggleCalendar();
              }
            }}
            disabled={(date) => date > new Date()}
          />
        </Card>
      )}
    </div>
  );
}