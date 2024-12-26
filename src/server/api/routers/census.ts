import { z } from "zod";
import { format } from "date-fns"; // Add this import to help with date formatting
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { censusFormSchema } from "@/components/census/types";
import { TRPCError } from "@trpc/server";
import type { CensusEntry } from '@/lib/schemas/census';
import type { CensusResponse, WhatsAppMessageResponse } from './types';
import type { Database } from '@/types/database';

type CensusEntryInsert = Database['public']['Tables']['census_entries']['Insert'];

export const censusRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(censusFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { supabase, user } = ctx;

        if (!user) {
          throw new TRPCError({ 
            code: 'UNAUTHORIZED',
            message: 'User must be logged in'
          });
        }

        // Calculate total patients
        const totalPatients = 
          input.previous_patients +
          (input.admissions ?? 0) +
          (input.referrals_in ?? 0) +
          (input.department_transfers_in ?? 0) -
          ((input.recovered ?? 0) +
           (input.lama ?? 0) +
           (input.absconded ?? 0) +
           (input.referred_out ?? 0) +
           (input.not_improved ?? 0) +
           (input.deaths ?? 0));

        const insertData: CensusEntryInsert = {
          department: input.department,
          date: format(input.date, 'yyyy-MM-dd'),
          previous_patients: input.previous_patients,
          admissions: input.admissions ?? 0,
          referrals_in: input.referrals_in ?? 0,
          department_transfers_in: input.department_transfers_in ?? 0,
          recovered: input.recovered ?? 0,
          lama: input.lama ?? 0,
          absconded: input.absconded ?? 0,
          referred_out: input.referred_out ?? 0,
          not_improved: input.not_improved ?? 0,
          deaths: input.deaths ?? 0,
          ot_cases: input.ot_cases ?? 0,
          current_patients: totalPatients,
          created_by: user.id
        };

        // Insert census entry
        const { data, error } = await supabase
          .from('census_entries')
          .insert(insertData)
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
          message: 'Failed to submit census entry',
          cause: error
        });
      }
    }),

  getLatest: protectedProcedure
    .input(z.object({
      department: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx;
      
      const { data, error } = await supabase
        .from('census_entries')
        .select('*')
        .eq('department', input.department)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      return data as CensusEntry;
    }),

  getByDate: protectedProcedure
    .input(z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Updated to expect string date
      department: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx;

      const { data, error } = await supabase
        .from('census_entries')
        .select('*')
        .eq('date', input.date)
        .eq('department', input.department)
        .single();

      if (error) throw error;
      
      return data as CensusEntry;
    }),

  generateMessage: protectedProcedure
    .input(censusFormSchema)
    .mutation(({ input }) => {   
      const totalIn = 
        (input.admissions ?? 0) + 
        (input.referrals_in ?? 0) + 
        (input.department_transfers_in ?? 0);

      const totalOut = 
        (input.recovered ?? 0) +
        (input.lama ?? 0) +
        (input.absconded ?? 0) +
        (input.referred_out ?? 0) +
        (input.not_improved ?? 0) +
        (input.deaths ?? 0);

      const currentPatients = 
        input.previous_patients + 
        totalIn - 
        totalOut;
      
      const displayDate = new Date(input.date).toLocaleDateString();

      const message = `*${input.department} Daily Census Report*
Date: ${displayDate}

Previous Patients: ${input.previous_patients}

*Transfers In*
- Admissions: ${input.admissions ?? 0}
- Referrals: ${input.referrals_in ?? 0}
- Department Transfers: ${input.department_transfers_in ?? 0}
Total In: ${totalIn}

*Transfers Out*
- Recovered: ${input.recovered ?? 0}
- LAMA: ${input.lama ?? 0}
- Absconded: ${input.absconded ?? 0}
- Referred Out: ${input.referred_out ?? 0}
- Not Improved: ${input.not_improved ?? 0}
- Deaths: ${input.deaths ?? 0}
Total Out: ${totalOut}

Current Patients: ${currentPatients}
OT Cases: ${input.ot_cases ?? 0}`;

      return { message } as WhatsAppMessageResponse;
    })
});