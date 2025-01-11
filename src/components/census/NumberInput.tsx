// src/components/census/NumberInput.tsx
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type UseFormReturn } from 'react-hook-form';
import { type CensusFormData } from '@/lib/schemas/census';
import { cn } from "@/lib/utils";

interface NumberInputProps {
  form: UseFormReturn<CensusFormData>;
  name: keyof CensusFormData; // Ensure name is one of the keys of CensusFormData
  label: string;
  className?: string;
}

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
              className={cn(
                "bg-background",
                className
              )}
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