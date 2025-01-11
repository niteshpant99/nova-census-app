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
import { type Department } from '@/components/dashboard/types';

interface DepartmentFilterProps {
  departments: Department[];
  selectedDepartments: string[];
  onSelectionChange: (departments: string[]) => void;
  className?: string;
}

export function DepartmentFilter({
  departments = [], // Add default value
  selectedDepartments = [], // Add default value
  onSelectionChange,
  className,
}: DepartmentFilterProps) {
  const [open, setOpen] = React.useState(false);

  // Add null checks before operations
  const toggleDepartment = (departmentId: string) => {
    if (!Array.isArray(selectedDepartments)) {
      onSelectionChange([departmentId]);
      return;
    }

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
          {Array.isArray(selectedDepartments) && selectedDepartments.length === 0
            ? "Select departments"
            : `${selectedDepartments?.length ?? 0} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search departments..." />
          <CommandEmpty>No department found.</CommandEmpty>
          <CommandGroup>
            {(departments ?? []).map((department) => (
              <CommandItem
                key={department.id}
                onSelect={() => toggleDepartment(department.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    (selectedDepartments ?? []).includes(department.id)
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