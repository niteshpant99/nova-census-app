// src/lib/schemas/census.ts
import { z } from "zod";
// import type { Database } from "@/types/database";

// TODO: NEED TO CHECK IF IT MATCHES OUR SUPABASE SCHEMA

// Type alias for the database census entry
// type DatabaseCensusEntry = Database["public"]["Tables"]["census_entries"]["Row"];

export const censusEntrySchema = z.object({
  // Basic info
  department: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"), // Changed from z.date()
  
  // Patient counts
  previous_patients: z.number().min(0),
  
  // Transfers in
  admissions: z.number().min(0).optional(),
  referrals_in: z.number().min(0).optional(),
  department_transfers_in: z.number().min(0).optional(),
  // Transfers out
  recovered: z.number().min(0).optional(),
  lama: z.number().min(0).optional(),
  absconded: z.number().min(0).optional(),
  referred_out: z.number().min(0).optional(),
  not_improved: z.number().min(0).optional(),
  deaths: z.number().min(0).optional(),
  
  // Additional data
  ot_cases: z.number().min(0).optional(),

});

// Type for form data
export type CensusFormData = z.infer<typeof censusEntrySchema>;

// Type for database entry (matches Supabase schema)
export interface CensusEntry {
  id: string;
  department: string;
  date: string;
  previous_patients: number;
  
  // Transfers in (nullable)
  admissions: number | null;
  referrals_in: number | null;
  department_transfers_in: number | null;
  total_transfers_in: number | null;
  
  // Transfers out (nullable)
  recovered: number | null;
  lama: number | null;
  absconded: number | null;
  referred_out: number | null;
  not_improved: number | null;
  deaths: number | null;
  total_transfers_out: number | null;
  
  // Additional data
  ot_cases: number | null;
  current_patients: number | null;
  
  // Metadata
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
  is_locked: boolean | null;
}

// Helper function for calculating totals
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