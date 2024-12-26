// src/components/census/NumberInput.tsx
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type UseFormReturn } from 'react-hook-form';
import { type CensusFormData } from '@/lib/schemas/census';
import { cn } from "@/lib/utils";

interface NumberInputProps {
  form: UseFormReturn<any>;  // Make form type more flexible
  name: string;
  label: string;
  className?: string;
}

// Make sure to destructure className from props
export function NumberInput({ form, name, label, className }: NumberInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="text"           // changed to text
              inputMode="numeric"
              pattern="[0-9]*"
              min="0"
              {...field}
              // Use cn utility to combine classes
              className={cn(
                "bg-background",
                className
              )}
              // Convert Date to string for the value prop
              // NEED TO CHANGE THIS
              // value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value} 
              // Ensure value is always a string
              value={field.value == null ? "" : String(field.value)}
              onChange={e => {
                const value = e.target.value === '' ? 0 : Number(e.target.value);
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}