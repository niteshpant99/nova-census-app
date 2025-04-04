// src/lib/schemas/census.ts
import { z } from "zod";

/**
 * Census Schema - Single source of truth for census data validation
 * Used by both client and server components
 */
export const censusEntrySchema = z.object({
  // Basic info
  department: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"),
  
  // Patient counts
  previous_patients: z.number().min(0),
  
  // Transfers in
  admissions: z.number().min(0).default(0),
  referrals_in: z.number().min(0).default(0),
  department_transfers_in: z.number().min(0).default(0),
  
  // Transfers out
  recovered: z.number().min(0).default(0),
  lama: z.number().min(0).default(0),
  absconded: z.number().min(0).default(0),
  referred_out: z.number().min(0).default(0),
  not_improved: z.number().min(0).default(0),
  deaths: z.number().min(0).default(0),
  
  // Additional data
  ot_cases: z.number().min(0).default(0),
});

// Type for form data
export type CensusFormData = z.infer<typeof censusEntrySchema>;

// Type for database entry (matches Supabase schema)
export interface CensusEntry {
  id: string;
  department: string;
  date: string;
  previous_patients: number;
  
  // Transfers in
  admissions: number;
  referrals_in: number;
  department_transfers_in: number;
  total_transfers_in: number;
  
  // Transfers out
  recovered: number;
  lama: number;
  absconded: number;
  referred_out: number;
  not_improved: number;
  deaths: number;
  total_transfers_out: number;
  
  // Additional data
  ot_cases: number;
  current_patients: number;
  
  // Metadata
  created_by: string;
  created_at: string;
  updated_at: string;
  is_locked: boolean;
  parent_department?: string;
}

/**
 * Calculate totals from census data
 * Should match the database computed column logic
 */
export const calculateTotals = (data: Partial<CensusFormData>) => {
  const total_transfers_in = 
    (data.admissions ?? 0) + 
    (data.referrals_in ?? 0) + 
    (data.department_transfers_in ?? 0);

  const total_transfers_out = 
    (data.recovered ?? 0) +
    (data.lama ?? 0) +
    (data.absconded ?? 0) +
    (data.referred_out ?? 0) +
    (data.not_improved ?? 0) +
    (data.deaths ?? 0);

  const current_patients = 
    (data.previous_patients ?? 0) + total_transfers_in - total_transfers_out;

  return {
    total_transfers_in,
    total_transfers_out,
    current_patients
  };
};