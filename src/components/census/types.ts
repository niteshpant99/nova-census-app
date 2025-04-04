// src/components/census/types.ts
// Instead of duplicating schema definition, import from the central source
import { censusEntrySchema, type CensusFormData, type CensusEntry } from '@/lib/schemas/census';

// Re-export for backward compatibility
export { censusEntrySchema };
export type { CensusFormData, CensusEntry };