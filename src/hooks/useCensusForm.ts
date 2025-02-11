// src/hooks/useCensusForm.ts
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { censusEntrySchema, type CensusFormData } from '@/lib/schemas/census';
import type { TRPCClientErrorLike } from '@trpc/client';
import type { AppRouter } from '@/server/api/root';
import { useQueryClient } from '@tanstack/react-query';

interface UseCensusFormOptions {
  initialDepartment: string;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export function useCensusForm({ 
  initialDepartment,
  onSaveSuccess,
  onSaveError
}: UseCensusFormOptions) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get latest census data for this department
  const { data: latestCensus } = api.census.getLatest.useQuery(
    { department: initialDepartment },
    { 
      enabled: !!initialDepartment,
      cacheTime: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  const form = useForm<CensusFormData>({
    resolver: zodResolver(censusEntrySchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      department: decodeURIComponent(initialDepartment),
      // Use latest census data for previous_patients if available
      previous_patients: latestCensus?.current_patients ?? 0,
      admissions: undefined,
      referrals_in: undefined,
      department_transfers_in: undefined,
      recovered: undefined,
      lama: undefined,
      absconded: undefined,
      referred_out: undefined,
      not_improved: undefined,
      deaths: undefined,
      ot_cases: undefined
    }
  });

  const submitMutation = api.census.submit.useMutation({
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message,
      });
      form.reset(form.getValues()); // Reset form but keep values
      setIsReviewing(false);
      onSaveSuccess?.();
      
      // Invalidate queries
      void invalidateQueries();
    },
    onError: (err: TRPCClientErrorLike<AppRouter>) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      setIsReviewing(false);
      onSaveError?.(new Error(err.message));
    },
  });

  const generateMessageMutation = api.census.generateMessage.useMutation();

  // Invalidate all relevant queries
  const invalidateQueries = useCallback(async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['dashboard.getDashboardStats'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard.getHistoricalData'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard.getDepartmentOccupancy'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard.getDischargeAnalytics'] }),
        queryClient.invalidateQueries({ queryKey: ['census.getByDate'] }),
        queryClient.invalidateQueries({ queryKey: ['census.getLatest'] })
      ]);
    } catch (error) {
      console.error('Error invalidating queries:', error);
    }
  }, [queryClient]);

  // Autosave functionality
  const saveData = useCallback(async (data: CensusFormData): Promise<boolean> => {
    try {
      setIsSaving(true);
      
      const processedData = {
        ...data,
        admissions: data.admissions ?? 0,
        referrals_in: data.referrals_in ?? 0,
        department_transfers_in: data.department_transfers_in ?? 0,
        recovered: data.recovered ?? 0,
        lama: data.lama ?? 0,
        absconded: data.absconded ?? 0,
        referred_out: data.referred_out ?? 0,
        not_improved: data.not_improved ?? 0,
        deaths: data.deaths ?? 0,
        ot_cases: data.ot_cases ?? 0
      };

      await submitMutation.mutateAsync(processedData);
      return true;
    } catch (error) {
      console.error('Autosave failed:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [submitMutation]);

  const handleSubmit = async (data: CensusFormData) => {
    try {
      const processedData = {
        ...data,
        admissions: data.admissions ?? 0,
        referrals_in: data.referrals_in ?? 0,
        department_transfers_in: data.department_transfers_in ?? 0,
        recovered: data.recovered ?? 0,
        lama: data.lama ?? 0,
        absconded: data.absconded ?? 0,
        referred_out: data.referred_out ?? 0,
        not_improved: data.not_improved ?? 0,
        deaths: data.deaths ?? 0,
        ot_cases: data.ot_cases ?? 0
      };

      const messageResponse = await generateMessageMutation.mutateAsync(processedData);
      await navigator.clipboard.writeText(messageResponse.message);
      
      toast({
        title: "Message Copied",
        description: "WhatsApp message copied to clipboard",
      });
      
      await submitMutation.mutateAsync(processedData);
    } catch (error) {
      console.error('Form submission failed:', error);
      toast({
        title: "Error",
        description: "Failed to submit census data",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: CensusFormData) => {
    if (!isReviewing) {
      setIsReviewing(true);
      return;
    }
    void handleSubmit(data);
  };

  return {
    form,
    showCalendar,
    isReviewing,
    isSubmitting: submitMutation.isPending || generateMessageMutation.isPending,
    isSaving,
    setShowCalendar,
    setIsReviewing,
    handleSubmit,
    onSubmit,
    saveData, // Expose saveData for autosave functionality
  };
}