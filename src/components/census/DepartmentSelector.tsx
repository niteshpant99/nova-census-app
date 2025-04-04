// src/components/census/DepartmentSelector.tsx
'use client';

import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type CensusFormData } from '@/lib/schemas/census';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEPARTMENTS, getAllDepartments } from '@/lib/config/departments';
import type { Department } from '@/types/department';

interface DepartmentSelectorProps {
  form: UseFormReturn<CensusFormData>;
}

interface DepartmentOption {
  id: string;
  name: string;
  isSubUnit: boolean;
  parentId?: string;
}

export function DepartmentSelector({ form }: DepartmentSelectorProps) {
  // Get all departments, including sub-units
  const departmentOptions = React.useMemo((): DepartmentOption[] => {
    // Get all departments including subunits
    const allDepts = getAllDepartments();
    
    // Transform to department options with isSubUnit flag
    return allDepts.map(dept => ({
      id: dept.id,
      name: dept.name,
      isSubUnit: !!dept.parentId,
      parentId: dept.parentId
    }));
  }, []);

  return (
    <FormField
      control={form.control}
      name="department"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Department</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departmentOptions.map((dept) => (
                <SelectItem 
                  key={dept.id} 
                  value={dept.id}
                  className={dept.isSubUnit ? 'pl-6 text-sm' : ''}
                >
                  {dept.name}
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