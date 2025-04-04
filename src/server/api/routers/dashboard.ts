// src/server/api/routers/dashboard.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { DashboardStats, DepartmentOccupancy, DischargeData } from '@/components/dashboard/types';
import { DEPARTMENTS, getDepartmentById } from '@/lib/config/departments';

export const dashboardRouter = createTRPCRouter({
  getDashboardStats: protectedProcedure
    .input(z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
    }))
    .query(async ({ ctx, input }): Promise<DashboardStats> => {
      try {
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

        if (!entries || !Array.isArray(entries)) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No census data found for the specified date',
          });
        }

        // Transform the data server-side
        const stats: DashboardStats = {
          totalPatients: 0,
          otCases: 0,
          patientFlow: { in: 0, out: 0 },
          occupancyRate: 0
        };

        let totalBeds = 0;

        entries.forEach(entry => {
          if (entry.current_patients) stats.totalPatients += entry.current_patients;
          if (entry.ot_cases) stats.otCases += entry.ot_cases;
          if (entry.total_transfers_in) stats.patientFlow.in += entry.total_transfers_in;
          if (entry.total_transfers_out) stats.patientFlow.out += entry.total_transfers_out;
          
          // Calculate total beds for departments in this census
          const deptConfig = getDepartmentById(entry.department);
          if (deptConfig) {
            totalBeds += deptConfig.totalBeds;
          }
        });

        // Calculate occupancy rate if we have bed data
        if (totalBeds > 0) {
          stats.occupancyRate = Math.round((stats.totalPatients / totalBeds) * 100);
        }

        return stats;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
          cause: error
        });
      }
    }),

  getHistoricalData: protectedProcedure
    .input(z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      departments: z.array(z.string())
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { supabase } = ctx;
        
        // Get data sorted by date
        const { data: entries, error } = await supabase
          .from('census_entries')
          .select('date, department, current_patients')
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

        if (!entries || !Array.isArray(entries) || entries.length === 0) {
          return [];
        }

        // Group entries by date 
        const dailyTotals = entries.reduce((acc, entry) => {
          const date = entry.date;
          if (!acc[date]) {
            acc[date] = {
              date,
              current_patients: 0
            };
          }
          
          // Add this entry's current_patients to the daily total
          acc[date].current_patients += entry.current_patients ?? 0;
          
          return acc;
        }, {} as Record<string, { date: string; current_patients: number }>);

        // Convert to array and sort by date
        const result = Object.values(dailyTotals)
          .sort((a, b) => a.date.localeCompare(b.date));
        
        return result;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch historical data',
          cause: error
        });
      }
    }),
  
  getDepartmentOccupancy: protectedProcedure
    .input(z.object({
      departments: z.array(z.string())
    }))
    .query(async ({ ctx, input }): Promise<DepartmentOccupancy[]> => {
      try {
        const { supabase } = ctx;

        // Get the most recent date with entries for all departments
        const { data: latestEntries, error: dateError } = await supabase
          .from('census_entries')
          .select('date')
          .in('department', input.departments)
          .order('date', { ascending: false })
          .limit(1);

        if (dateError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: dateError.message,
          });
        }

        if (!latestEntries || latestEntries.length === 0) {
          return [];
        }

        const latestDate = latestEntries[0]?.date;
        
        if (!latestDate) {
          return [];
        }

        // Get the current census entries for all departments
        const { data: entries, error } = await supabase
          .from('census_entries')
          .select('department, current_patients')
          .eq('date', latestDate)
          .in('department', input.departments);

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }

        if (!entries || !Array.isArray(entries)) {
          return [];
        }

        // Combine with department capacity information
        const result: DepartmentOccupancy[] = entries.map(entry => {
          const deptConfig = getDepartmentById(entry.department);
          const totalBeds = deptConfig?.totalBeds ?? 0;
          
          return {
            department: entry.department,
            current: entry.current_patients ?? 0,
            total: totalBeds,
            percentage: totalBeds > 0 
              ? Math.round(((entry.current_patients ?? 0) / totalBeds) * 100) 
              : 0
          };
        });

        // Sort by occupancy percentage (highest first)
        return result.sort((a, b) => b.percentage - a.percentage);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch department occupancy',
          cause: error
        });
      }
    }),

  getDischargeAnalytics: protectedProcedure
    .input(z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      departments: z.array(z.string())
    }))
    .query(async ({ ctx, input }): Promise<DischargeData[]> => {
      try {
        const { supabase } = ctx;
    
        const { data: entries, error } = await supabase
          .from('census_entries')
          .select('department, recovered, lama, absconded, referred_out, not_improved, deaths')
          .in('department', input.departments)
          .gte('date', input.startDate)
          .lte('date', input.endDate);
    
        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }

        if (!entries || !Array.isArray(entries) || entries.length === 0) {
          return [];
        }
    
        // Group and aggregate discharge data by department
        const dischargeData = entries.reduce<Record<string, DischargeData>>((acc, entry) => {
          const dept = entry.department;
          if (!acc[dept]) {
            acc[dept] = {
              department: dept,
              recovered: 0,
              lama: 0,
              absconded: 0,
              referred: 0,
              notImproved: 0,
              deaths: 0
            };
          }
    
          acc[dept].recovered += entry.recovered ?? 0;
          acc[dept].lama += entry.lama ?? 0;
          acc[dept].absconded += entry.absconded ?? 0;
          acc[dept].referred += entry.referred_out ?? 0;
          acc[dept].notImproved += entry.not_improved ?? 0;
          acc[dept].deaths += entry.deaths ?? 0;
    
          return acc;
        }, {});
    
        return Object.values(dischargeData);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch discharge analytics',
          cause: error
        });
      }
    })  
});