// src/components/census/NumberInput.tsx
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CensusFormData } from '@/lib/schemas/census';

interface NumberInputProps {
  form: UseFormReturn<CensusFormData>;
  name: keyof CensusFormData;
  label: string;
}

export function NumberInput({ form, name, label }: NumberInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min="0"
              {...field}
              // Convert Date to string for the value prop
              value={field.value instanceof Date ? field.value.toISOString() : field.value}
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