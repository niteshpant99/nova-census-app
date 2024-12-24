// src/components/census/DatePicker.tsx
import { Calendar } from "@/components/ui/calendar";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CensusFormData } from "@/lib/schemas/census";
import { api } from "@/lib/api";

interface DatePickerProps {
  form: UseFormReturn<CensusFormData>;
  department: string;
}

export function DatePicker({ form, department }: DatePickerProps) {
  const { data: existingEntry } = api.census.getByDate.useQuery({
    date: form.getValues("date"),
    department
  });

  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date</FormLabel>
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={(date) => {
              if (date && !existingEntry) {
                field.onChange(date);
              }
            }}
            disabled={(date) => {
              // Disable future dates and dates with existing entries
              return date > new Date() || Boolean(existingEntry);
            }}
          />
        </FormItem>
      )}
    />
  );
}