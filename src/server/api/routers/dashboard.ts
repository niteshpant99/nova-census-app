// src/server/api/routers/dashboard.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { CensusEntry } from "@/types/database";

// Add this interface near the top of the file with your other types
interface DischargeData {
  department: string;
  recovered: number;
  lama: number;
  absconded: number;
  referred: number;
  notImproved: number;
  deaths: number;
}

const dateRangeSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  departments: z.array(z.string())
});

export const dashboardRouter = createTRPCRouter({
  getDashboardStats: protectedProcedure
    .input(z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    }))
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx;

      const { data: entries, error } = await supabase
        .from('census_entries')
        .select('*')
        .eq('date', input.date);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
      
      
      return entries as CensusEntry[]; // Return the raw entries

      // // Calculate totals from the day's entries
      // const stats = (entries as CensusEntry[]).reduce((acc, entry) => ({
      //   totalPatients: acc.totalPatients + (entry.current_patients ?? 0),
      //   otCases: acc.otCases + (entry.ot_cases ?? 0),
      //   patientFlow: {
      //     in: acc.patientFlow.in + ((entry.total_transfers_in ?? 0)),
      //     out: acc.patientFlow.out + ((entry.total_transfers_out ?? 0))
      //   }
      // }), {
      //   totalPatients: 0,
      //   otCases: 0,
      //   patientFlow: { in: 0, out: 0 }
      // });

      // return stats;
    }),

  getDepartmentOccupancy: protectedProcedure
    .input(z.object({
      departments: z.array(z.string())
    }))
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx;

      const { data: entries, error } = await supabase
        .from('census_entries')
        .select('*')
        .in('department', input.departments)
        .order('date', { ascending: false })
        .limit(input.departments.length); // Get latest entry for each department

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return entries;
    }),

  getHistoricalData: protectedProcedure
    .input(dateRangeSchema)
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx;

      const { data: entries, error } = await supabase
        .from('census_entries')
        .select('*')
        .in('department', input.departments)
        .gte('date', input.startDate)
        .lte('date', input.endDate)
        .order('date', { ascending: true });

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return entries;
    }),

    getDischargeAnalytics: protectedProcedure
    .input(dateRangeSchema)
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx;

      const { data: entries, error } = await supabase
        .from('census_entries')
        .select('*')
        .in('department', input.departments)
        .gte('date', input.startDate)
        .lte('date', input.endDate);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      // Aggregate discharge data by department
    const dischargeData = (entries as CensusEntry[]).reduce<Record<string, DischargeData>>((acc, entry) => {
      const dept = acc[entry.department] ?? {
        department: entry.department,
        recovered: 0,
        lama: 0,
        absconded: 0,
        referred: 0,
        notImproved: 0,
        deaths: 0
      };

      acc[entry.department] = {
        ...dept,
        recovered: dept.recovered + (entry.recovered ?? 0),
        lama: dept.lama + (entry.lama ?? 0),
        absconded: dept.absconded + (entry.absconded ?? 0),
        referred: dept.referred + (entry.referred_out ?? 0),
        notImproved: dept.notImproved + (entry.not_improved ?? 0),
        deaths: dept.deaths + (entry.deaths ?? 0)
      };

      return acc;
    }, {});

    return Object.values(dischargeData);
  }),
});