// src/server/api/routers/census.ts
import { z } from "zod";
import { format } from "date-fns";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { censusEntrySchema, type CensusEntry, calculateTotals } from '@/lib/schemas/census';
import type { Database } from '@/types/database';

// Response types
interface CensusResponse {
  success: boolean;
  data: CensusEntry;
  message: string;
}

interface WhatsAppMessageResponse {
  message: string;
}

type CensusEntryInsert = Database['public']['Tables']['census_entries']['Insert'];

export const censusRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(censusEntrySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { supabase, user } = ctx;

        if (!user) {
          throw new TRPCError({ 
            code: 'UNAUTHORIZED',
            message: 'User must be logged in'
          });
        }

        // Use the shared calculation utility
        const { total_transfers_in, total_transfers_out, current_patients } = calculateTotals(input);

        const insertData: CensusEntryInsert = {
          department: input.department,
          date: format(new Date(input.date), 'yyyy-MM-dd'),
          previous_patients: input.previous_patients,
          admissions: input.admissions,
          referrals_in: input.referrals_in,
          department_transfers_in: input.department_transfers_in,
          recovered: input.recovered,
          lama: input.lama,
          absconded: input.absconded,
          referred_out: input.referred_out,
          not_improved: input.not_improved,
          deaths: input.deaths,
          ot_cases: input.ot_cases,
          current_patients,
          created_by: user.id
        };

        // Insert census entry
        const { data, error } = await supabase
          .from('census_entries')
          .upsert(insertData, { 
            onConflict: 'department,date', 
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }
          
        if (!data) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No data returned from insert operation',
          });
        }

        // Log the action
        await supabase
          .from('audit_logs')
          .insert({
            record_id: data.id,
            table_name: 'census_entries',
            action: 'CREATE',
            changed_by: user.id,
            new_data: data
          });

        return {
          success: true,
          data: data as CensusEntry,
          message: 'Census entry created successfully'
        } as CensusResponse;

      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to submit census entry',
          cause: error
        });
      }
    }),

  getLatest: protectedProcedure
    .input(z.object({
      department: z.string()
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { supabase } = ctx;
        
        const { data, error } = await supabase
          .from('census_entries')
          .select('*')
          .eq('department', input.department)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }

        return data as CensusEntry;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch latest census entry',
          cause: error
        });
      }
    }),

  getByDate: protectedProcedure
    .input(z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      department: z.string()
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { supabase } = ctx;

        const { data, error } = await supabase
          .from('census_entries')
          .select('*')
          .eq('date', input.date)
          .eq('department', input.department)
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }
        
        return data as CensusEntry;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch census entry by date',
          cause: error
        });
      }
    }),

  generateMessage: protectedProcedure
    .input(censusEntrySchema)
    .mutation(({ input }) => {   
      // Use shared utility to calculate totals
      const { total_transfers_in, total_transfers_out, current_patients } = calculateTotals(input);
      
      const displayDate = new Date(input.date).toLocaleDateString();

      const message = `*${input.department} Daily Census Report*
Date: ${displayDate}

Previous Patients: ${input.previous_patients}

*Transfers In*
- Admissions: ${input.admissions}
- Referrals: ${input.referrals_in}
- Department Transfers: ${input.department_transfers_in}
Total In: ${total_transfers_in}

*Transfers Out*
- Recovered: ${input.recovered}
- LAMA: ${input.lama}
- Absconded: ${input.absconded}
- Referred Out: ${input.referred_out}
- Not Improved: ${input.not_improved}
- Deaths: ${input.deaths}
Total Out: ${total_transfers_out}

Current Patients: ${current_patients}
OT Cases: ${input.ot_cases}`;

      return { message } as WhatsAppMessageResponse;
    })
});