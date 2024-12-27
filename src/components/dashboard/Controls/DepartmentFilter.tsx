// src/components/dashboard/Controls/DepartmentFilter.tsx
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { type Department } from '../types';

interface DepartmentFilterProps {
  departments: Department[];
  selectedDepartments: string[];
  onSelectionChange: (departments: string[]) => void;
  className?: string;
}

export function DepartmentFilter({
  departments,
  selectedDepartments,
  onSelectionChange,
  className,
}: DepartmentFilterProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDepartment = (departmentId: string) => {
    const isSelected = selectedDepartments.includes(departmentId);
    if (isSelected) {
      onSelectionChange(selectedDepartments.filter(id => id !== departmentId));
    } else {
      onSelectionChange([...selectedDepartments, departmentId]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedDepartments.length === 0
            ? "Select departments"
            : `${selectedDepartments.length} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search departments..." />
          <CommandEmpty>No department found.</CommandEmpty>
          <CommandGroup>
            {departments.map((department) => (
              <CommandItem
                key={department.id}
                onSelect={() => toggleDepartment(department.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedDepartments.includes(department.id)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {department.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}