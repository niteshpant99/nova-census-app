// src/components/census/types.ts
import { z } from 'zod';

export const censusFormSchema = z.object({
  department: z.string(),
  date: z.string(),
  previousPatients: z.number().min(0),
  // Transfers in
  admissions: z.number().min(0),
  referralsIn: z.number().min(0),
  departmentTransfersIn: z.number().min(0),
  // Transfers out
  recovered: z.number().min(0),
  lama: z.number().min(0),
  absconded: z.number().min(0),
  referredOut: z.number().min(0),
  notImproved: z.number().min(0),
  deaths: z.number().min(0),
  otCases: z.number().min(0),
});

export type CensusFormData = z.infer<typeof censusFormSchema>;