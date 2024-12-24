// src/components/census/types.ts
import { z } from 'zod';

export const censusFormSchema = z.object({
  department: z.string(),
  date: z.date(),
  previous_patients: z.number().min(0),
  // Transfers in
  admissions: z.number().min(0),
  referrals_in: z.number().min(0),
  department_transfers_in: z.number().min(0),
  // Transfers out
  recovered: z.number().min(0),
  lama: z.number().min(0),
  absconded: z.number().min(0),
  referred_out: z.number().min(0),
  not_improved: z.number().min(0),
  deaths: z.number().min(0),
  ot_cases: z.number().min(0),
});

export type CensusFormData = z.infer<typeof censusFormSchema>;