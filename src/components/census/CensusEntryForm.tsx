// src/components/census/CensusEntryForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { censusFormSchema, type CensusFormData } from './types';
import { DepartmentSelector } from './DepartmentSelector';
import { TransfersInSection } from './TransfersInSection';
import { TransfersOutSection } from './TransfersOutSection';
import { NumberInput } from './NumberInput';

export function CensusEntryForm() {
  const [isPreview, setIsPreview] = useState(false);
  
  const form = useForm<CensusFormData>({
    resolver: zodResolver(censusFormSchema),
    defaultValues: {
      date: new Date(),  //format(new Date(), 'yyyy-MM-dd'),
      previous_patients: 0,
      admissions: 0,
      referrals_in: 0,
      department_transfers_in: 0,
      recovered: 0,
      lama: 0,
      absconded: 0,
      referred_out: 0,
      not_improved: 0,
      deaths: 0,
      ot_cases: 0,
    },
  });

  async function onSubmit(values: CensusFormData) {
    if (isPreview) {
      // TODO: Implement final submission
      console.log('Final submission:', values);
    } else {
      setIsPreview(true);
    }
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <h2 className="text-2xl font-bold">
          {isPreview ? 'Review Census Entry' : 'Daily Census Entry'}
        </h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DepartmentSelector form={form} />
            
            <NumberInput 
              form={form} 
              name="date" 
              label="Date" 
            />
            
            <NumberInput 
              form={form} 
              name="previous_patients" 
              label="Previous Patients" 
            />
            
            <TransfersInSection form={form} />
            <TransfersOutSection form={form} />
            
            <NumberInput 
              form={form} 
              name="ot_cases" 
              label="OT Cases" 
            />

            <div className="flex justify-end space-x-4">
              {isPreview ? (
                <>
                  <Button type="button" variant="outline" onClick={() => setIsPreview(false)}>
                    Edit
                  </Button>
                  <Button type="submit">Submit</Button>
                </>
              ) : (
                <Button type="submit">Review</Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}