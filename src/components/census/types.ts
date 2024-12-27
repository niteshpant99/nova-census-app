// src/components/census/types.ts
import { z } from 'zod';

export const censusFormSchema = z.object({
  department: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"),
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
  ot_cases: z.number().min(0).optional(),
});

export type CensusFormData = z.infer<typeof censusFormSchema>;