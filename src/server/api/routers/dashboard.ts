// src/server/api/routers/dashboard.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { DashboardStats, DepartmentOccupancy, DischargeData } from '@/components/dashboard/types';

export const dashboardRouter = createTRPCRouter({
  getDashboardStats: protectedProcedure
    .input(z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    }))
    .query(async ({ ctx, input }): Promise<DashboardStats> => {
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

      // Transform the data server-side
      const stats: DashboardStats = {
        totalPatients: 0,
        otCases: 0,
        patientFlow: { in: 0, out: 0 },
        occupancyRate: 0
      };

      entries.forEach(entry => {
        if (entry.current_patients) stats.totalPatients += entry.current_patients;
        if (entry.ot_cases) stats.otCases += entry.ot_cases;
        if (entry.total_transfers_in) stats.patientFlow.in += entry.total_transfers_in;
        if (entry.total_transfers_out) stats.patientFlow.out += entry.total_transfers_out;
      });

      return stats;
    }),

  getHistoricalData: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      departments: z.array(z.string())
    }))
    .query(async ({ ctx, input }): Promise<Array<{ date: string; current_patients: number }>> => {
      const { supabase } = ctx;
      
      console.log('Input params:', input); // Debug log

      const { data: entries, error } = await supabase
        .from('census_entries')
        .select('*')
        .in('department', input.departments)
        .gte('date', input.startDate)
        .lte('date', input.endDate);
      
      console.log('Raw Supabase response:', entries); // Debug log

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      // Group by date and sum current_patients
      const dailyTotals = entries.reduce((acc, entry) => {
        const date = entry.date;
        if (!acc[date]) {
          acc[date] = { date, current_patients: 0 };
        }
        acc[date].current_patients += entry.current_patients ?? 0;
        return acc;
      }, {} as Record<string, { date: string; current_patients: number }>);

      console.log('Processed data:', Object.values(dailyTotals)); // Debug log
      
      return Object.values(dailyTotals);
    }),

  getDepartmentOccupancy: protectedProcedure
    .input(z.object({
      departments: z.array(z.string())
    }))
    .query(async ({ ctx, input }): Promise<DepartmentOccupancy[]> => {
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

      // Transform data server-side
      return entries.map(entry => ({
        department: entry.department,
        current: entry.current_patients ?? 0,
        total: 0,           // This will be handled by the department service
        percentage: 0       // This will be calculated after getting total beds
      }));
    }),

    getDischargeAnalytics: protectedProcedure
    .input(z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      departments: z.array(z.string())
    }))
    .query(async ({ ctx, input }): Promise<DischargeData[]> => {
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
  
      // Group and aggregate discharge data by department
      const dischargeData = entries.reduce<Record<string, DischargeData>>((acc, entry) => {
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
    })  
});