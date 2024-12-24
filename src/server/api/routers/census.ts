// src/server/api/routers/census.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { censusFormSchema } from "@/components/census/types";
import { TRPCError } from "@trpc/server";

export const censusRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(censusFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const context = await ctx;
        const { supabase, user } = context;

        if (!user) {
          throw new TRPCError({ 
            code: 'UNAUTHORIZED',
            message: 'User must be logged in'
          });
        }

        // Calculate total patients
        const totalPatients = 
          input.previous_patients +
          input.admissions +
          input.referrals_in +
          input.department_transfers_in -
          (input.recovered +
           input.lama +
           input.absconded +
           input.referred_out +
           input.not_improved +
           input.deaths);

        // Insert census entry
        const { data, error } = await supabase
          .from('census_entries')
          .insert({
            department: input.department,
            date: input.date,
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
            total_patients: totalPatients,
            created_by: user.id
          })
          .select()
          .single();

        if (error) throw error;

        // Log the action
        await supabase
          .from('audit_logs')
          .insert({
            entry_id: data.id,
            action: 'CREATE',
            performed_by: user.id
          });

        return {
          success: true,
          data,
          message: 'Census entry created successfully'
        };
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
      const context = await ctx;
      const { supabase } = context;
      
      const { data, error } = await supabase
        .from('census_entries')
        .select('*')
        .eq('department', input.department)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      return data;
    }),

  getByDate: protectedProcedure
    .input(z.object({
      date: z.date(),
      department: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const context = await ctx;
      const { supabase } = context;

      const { data, error } = await supabase
        .from('census_entries')
        .select('*')
        .eq('date', input.date)
        .eq('department', input.department)
        .single();

      if (error) throw error;
      
      return data;
    }),

  generateMessage: protectedProcedure
    .input(censusFormSchema)
    .mutation(({ input }) => {
      const totalIn = 
        input.admissions + 
        input.referrals_in + 
        input.department_transfers_in;

      const totalOut = 
        input.recovered +
        input.lama +
        input.absconded +
        input.referred_out +
        input.not_improved +
        input.deaths;

      const currentPatients = 
        input.previous_patients + 
        totalIn - 
        totalOut;

      return {
        message: `*${input.department} Daily Census Report*
Date: ${input.date}

Previous Patients: ${input.previous_patients}

*Transfers In*
- Admissions: ${input.admissions}
- Referrals: ${input.referrals_in}
- Department Transfers: ${input.department_transfers_in}
Total In: ${totalIn}

*Transfers Out*
- Recovered: ${input.recovered}
- LAMA: ${input.lama}
- Absconded: ${input.absconded}
- Referred Out: ${input.referred_out}
- Not Improved: ${input.not_improved}
- Deaths: ${input.deaths}
Total Out: ${totalOut}

Current Patients: ${currentPatients}
OT Cases: ${input.ot_cases}`
      };
    })
});