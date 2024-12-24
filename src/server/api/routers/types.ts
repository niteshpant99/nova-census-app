// src/server/api/routers/types.ts
export interface CensusResponse {
    success: boolean;
    data: any; // Replace with specific type if needed
    message: string;
  }
  
  export interface WhatsAppMessageResponse {
    message: string;
  }