// src/server/api/routers/types.ts
import type { CensusEntry } from '@/lib/schemas/census';

export interface CensusResponse {
  success: boolean;
  data: CensusEntry | null;
  message: string;
}
  
  export interface WhatsAppMessageResponse {
    message: string;
  }