// src/components/census/TransfersOutSection.tsx
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CensusFormData } from './types';
import { NumberInput } from './NumberInput';

interface TransfersOutSectionProps {
  form: UseFormReturn<CensusFormData>;
}

export function TransfersOutSection({ form }: TransfersOutSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Transfers Out</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <NumberInput form={form} name="recovered" label="Recovered" />
        <NumberInput form={form} name="lama" label="LAMA" />
        <NumberInput form={form} name="absconded" label="Absconded" />
        <NumberInput form={form} name="referred_out" label="Referred Out" />
        <NumberInput form={form} name="not_improved" label="Not Improved" />
        <NumberInput form={form} name="deaths" label="Deaths" />
      </div>
    </div>
  );
}