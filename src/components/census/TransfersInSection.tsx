// src/components/census/TransfersInSection.tsx
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CensusFormData } from './types';
import { NumberInput } from './NumberInput';

interface TransfersInSectionProps {
  form: UseFormReturn<CensusFormData>;
}

export function TransfersInSection({ form }: TransfersInSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Transfers In</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <NumberInput form={form} name="admissions" label="Admissions" />
        <NumberInput form={form} name="referralsIn" label="Referrals In" />
        <NumberInput form={form} name="departmentTransfersIn" label="Dept Transfers In" />
      </div>
    </div>
  );
}