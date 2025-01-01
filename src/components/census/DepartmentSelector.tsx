// src/components/census/DepartmentSelector.tsx
import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type CensusFormData } from './types';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEPARTMENTS } from '@/components/dashboard/config/departments';

interface DepartmentSelectorProps {
  form: UseFormReturn<CensusFormData>;
}

// TODO: In future versions, consolidate department types and handling 
// across dashboard and census components into a shared module
export function DepartmentSelector({ form }: DepartmentSelectorProps) {
  const departmentOptions = React.useMemo(() => {
    return DEPARTMENTS.reduce((acc, dept) => {
      // Add main department
      acc.push({
        id: dept.id,
        name: dept.name,
        isSubUnit: false
      });

      // Add sub-units if the main department is selected
      if (dept.id === form.watch('department') && dept.subUnits) {
        dept.subUnits.forEach(unit => {
          acc.push({
            id: unit.id,
            name: unit.name,
            isSubUnit: true,
            parentId: unit.parentId
          });
        });
      }

      return acc;
    }, [] as Array<{
      id: string;
      name: string;
      isSubUnit: boolean;
      parentId?: string;
    }>);
  }, [form.watch('department')]);     // Add form.watch('department') as dependency, leads to some lint errors tho

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