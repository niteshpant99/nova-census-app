// src/lib/schemas/census.ts
import { z } from "zod";

export const censusEntrySchema = z.object({
  // Basic info
  department: z.string(),
  date: z.date(),
  
  // Patient counts
  previous_patients: z.number().min(0, "Must be 0 or greater"),
  
  // Transfers in
  admissions: z.number().min(0, "Must be 0 or greater"),
  referrals_in: z.number().min(0, "Must be 0 or greater"),
  department_transfers_in: z.number().min(0, "Must be 0 or greater"),
  
  // Transfers out
  recovered: z.number().min(0, "Must be 0 or greater"),
  lama: z.number().min(0, "Must be 0 or greater"),
  absconded: z.number().min(0, "Must be 0 or greater"),
  referred_out: z.number().min(0, "Must be 0 or greater"),
  not_improved: z.number().min(0, "Must be 0 or greater"),
  deaths: z.number().min(0, "Must be 0 or greater"),
  
  // Additional data
  ot_cases: z.number().min(0, "Must be 0 or greater").default(0),
});

// Type for form data
export type CensusFormData = z.infer<typeof censusEntrySchema>;

// Type for database entry (includes computed fields and metadata)
export interface CensusEntry extends CensusFormData {
  id: string;
  // Computed fields
  total_transfers_in: number;
  total_transfers_out: number;
  current_patients: number;
  // Metadata
  created_by: string;
  created_at: Date;
  updated_at: Date;
  is_locked: boolean;
}

// Helper functions for calculations
export const calculateTotals = (data: Partial<CensusFormData>) => {
  const total_transfers_in = 
    (data.admissions || 0) + 
    (data.referrals_in || 0) + 
    (data.department_transfers_in || 0);

  const total_transfers_out = 
    (data.recovered || 0) +
    (data.lama || 0) +
    (data.absconded || 0) +
    (data.referred_out || 0) +
    (data.not_improved || 0) +
    (data.deaths || 0);

  const current_patients = 
    (data.previous_patients || 0) + total_transfers_in - total_transfers_out;

  return {
    total_transfers_in,
    total_transfers_out,
    current_patients
  };
};