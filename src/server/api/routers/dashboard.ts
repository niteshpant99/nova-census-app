// src/server/api/routers/dashboard.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { CensusEntry } from "@/types/database";
import type { DashboardStats, DepartmentOccupancy } from '@/components/dashboard/types';

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

      const stats: DashboardStats = {
        totalPatients: 0,
        otCases: 0,
        patientFlow: { in: 0, out: 0 },
        occupancyRate: 0
      };

      (entries as CensusEntry[]).forEach(entry => {
        if (entry.current_patients) stats.totalPatients += entry.current_patients;
        if (entry.ot_cases) stats.otCases += entry.ot_cases;
        if (entry.total_transfers_in) stats.patientFlow.in += entry.total_transfers_in;
        if (entry.total_transfers_out) stats.patientFlow.out += entry.total_transfers_out;
      });

      return stats;
    }),

  getDepartmentOccupancy: protectedProcedure
    .input(z.object({ departments: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx;

      const { data: entries, error } = await supabase
        .from('census_entries')
        .select('*')
        .in('department', input.departments)
        .order('date', { ascending: false })
        .limit(input.departments.length);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return (entries as CensusEntry[]).map(entry => ({
        department: entry.department,
        current: entry.current_patients ?? 0,
        total: ctx.departmentService.getDepartmentTotalBeds(entry.department),
        percentage: ctx.departmentService.calculateDepartmentOccupancy(
          entry.department,
          entry.current_patients ?? 0
        )
      }));
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

      return (entries as CensusEntry[]).map(entry => ({
        date: entry.date,
        value: entry.current_patients ?? 0
      }));
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