// src/components/census/CensusFormFields.tsx
import React from "react";
import { NumberInput } from "@/components/census/NumberInput";

import type { useForm } from "react-hook-form";
import type { CensusFormData } from "@/lib/schemas/census";

interface CensusFormFieldsProps {
  form: ReturnType<typeof useForm<CensusFormData>>;
}

const CensusFormFields: React.FC<CensusFormFieldsProps> = ({ form }) => (
  <>
    {/* Old Patients */}
    <NumberInput
      form={form}
      name="previous_patients"
      label="Old patients"
      className="bg-background"
    />

    {/* Transfer In Section */}
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Transfer in</h3>
      <NumberInput
        form={form}
        name="referrals_in"
        label="Referred in"
        className="bg-background"
      />
      <NumberInput
        form={form}
        name="department_transfers_in"
        label="Department Transfers"
        className="bg-background"
      />
      <NumberInput
        form={form}
        name="admissions"
        label="Admissions"
        className="bg-background"
      />
    </div>

    {/* Transfer Out Section */}
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Transfer out</h3>
      <NumberInput
        form={form}
        name="recovered"
        label="Recovered"
        className="bg-background"
      />
      <NumberInput
        form={form}
        name="lama"
        label="LAMA"
        className="bg-background"
      />
      <NumberInput
        form={form}
        name="absconded"
        label="Absconded"
        className="bg-background"
      />
      <NumberInput
        form={form}
        name="referred_out"
        label="Referred out"
        className="bg-background"
      />
      <NumberInput
        form={form}
        name="not_improved"
        label="Not improved"
        className="bg-background"
      />
      <NumberInput
        form={form}
        name="deaths"
        label="Deaths"
        className="bg-background"
      />
    </div>

    {/* OT Cases */}
    <NumberInput
      form={form}
      name="ot_cases"
      label="OT Cases"
      className="bg-background"
    />
  </>
);

export default CensusFormFields;