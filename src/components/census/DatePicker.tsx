// src/components/census/DatePicker.tsx
import { Calendar } from "@/components/ui/calendar";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import { type CensusEntry, type CensusFormData } from "@/lib/schemas/census";
import { api } from "@/lib/api";
import { format } from "date-fns";


interface DatePickerProps {
  form: UseFormReturn<CensusFormData>;
  department: string;
  onSelect?: () => void; // Add optional onSelect callback
}

export function DatePicker({ 
  form, 
  department,
  onSelect = () => void 0     // provide default value for onSelect
}: DatePickerProps) {
  const { data: existingEntry } = api.census.getByDate.useQuery({
       date: form.getValues("date"),
      department
     }) as { data: CensusEntry | null };
    
  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date</FormLabel>
          <Calendar
            mode="single"
            selected={field.value ? new Date(field.value) : undefined}
            onSelect={(date) => {
              if (date) {
                // Convert Date to YYYY-MM-DD string
                field.onChange(format(date, 'yyyy-MM-dd'));
                onSelect?.(); // Call onSelect if provided
              }
            }}
            disabled={(date) => {
              return date > new Date() || Boolean(existingEntry);
            }}
          />
        </FormItem>
      )}
    />
  );
}

// export function DatePicker({ form, department }: DatePickerProps) {
//   const { data: existingEntry } = api.census.getByDate.useQuery({
//     date: form.getValues("date"),
//     department
//   }) as { data: CensusEntry | null };

//   return (
//     <FormField
//       control={form.control}
//       name="date"
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>Date</FormLabel>
//           <Calendar
//             mode="single"
//             selected={field.value}
//             onSelect={(date) => {
//               if (date && !existingEntry) {
//                 field.onChange(date);
//               }
//             }}
//             disabled={(date) => {
//               // Disable future dates and dates with existing entries
//               return date > new Date() || Boolean(existingEntry);
//             }}
//           />
//         </FormItem>
//       )}
//     />
//   );
// }