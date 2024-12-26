// src/components/census/DepartmentSelector.tsx
import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type CensusFormData } from './types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DepartmentSelectorProps {
  form: UseFormReturn<CensusFormData>;
}

const departments = ['NICU', 'ICU', 'General Ward', 'Pediatric Ward'];

export function DepartmentSelector({ form }: DepartmentSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="department"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Department</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}