// src/server/api/routers/census.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { censusFormSchema } from "@/components/census/types";
import { TRPCError } from "@trpc/server";

export const censusRouter = createTRPCRouter({
  // Submit new census entry
  submit: protectedProcedure
    .input(censusFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { supabase, user } = ctx;

        // Calculate total patients
        const totalPatients = 
          input.previousPatients +
          input.admissions +
          input.referralsIn +
          input.departmentTransfersIn -
          (input.recovered +
           input.lama +
           input.absconded +
           input.referredOut +
           input.notImproved +
           input.deaths);

        // Insert census entry
        const { data, error } = await supabase
          .from('census_entries')
          .insert({
            department: input.department,
            date: input.date,
            previous_patients: input.previousPatients,
            admissions: input.admissions,
            referrals_in: input.referralsIn,
            department_transfers_in: input.departmentTransfersIn,
            recovered: input.recovered,
            lama: input.lama,
            absconded: input.absconded,
            referred_out: input.referredOut,
            not_improved: input.notImproved,
            deaths: input.deaths,
            ot_cases: input.otCases,
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

  // Get latest census entry for a department
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

      return data;
    }),

  // Generate WhatsApp message format
  generateMessage: protectedProcedure
    .input(censusFormSchema)
    .mutation(({ input }) => {
      const totalIn = 
        input.admissions + 
        input.referralsIn + 
        input.departmentTransfersIn;

      const totalOut = 
        input.recovered +
        input.lama +
        input.absconded +
        input.referredOut +
        input.notImproved +
        input.deaths;

      const currentPatients = 
        input.previousPatients + 
        totalIn - 
        totalOut;

      return {
        message: `*${input.department} Daily Census Report*
Date: ${input.date}

Previous Patients: ${input.previousPatients}

*Transfers In*
• Admissions: ${input.admissions}
• Referrals: ${input.referralsIn}
• Department Transfers: ${input.departmentTransfersIn}
Total In: ${totalIn}

*Transfers Out*
• Recovered: ${input.recovered}
• LAMA: ${input.lama}
• Absconded: ${input.absconded}
• Referred Out: ${input.referredOut}
• Not Improved: ${input.notImproved}
• Deaths: ${input.deaths}
Total Out: ${totalOut}

Current Patients: ${currentPatients}
OT Cases: ${input.otCases}`
      };
    })
});