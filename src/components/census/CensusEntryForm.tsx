// src/components/census/CensusEntryForm.tsx
'use client';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TransfersInSection } from './TransfersInSection';
import { TransfersOutSection } from './TransfersOutSection';
import { NumberInput } from './NumberInput';
import { ReviewScreen } from './ReviewScreen';
import { DatePicker } from './DatePicker';
import { useCensusForm } from '@/hooks/useCensusForm';

interface CensusEntryFormProps {
  initialDepartment: string;
}

export function CensusEntryForm({ initialDepartment }: CensusEntryFormProps) {
  const {
    form,
    isReviewing,
    isSubmitting,
    showCalendar,
    setShowCalendar,
    setIsReviewing,
    handleSubmit,
    onSubmit,
  } = useCensusForm({ initialDepartment });

  if (isReviewing) {
    return (
      <ReviewScreen
        data={form.getValues()}
        onSubmit={() => handleSubmit(form.getValues())}
        onEdit={() => setIsReviewing(false)}
        isLoading={isSubmitting}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Date Selection */}
        <Button
          type="button"
          variant="outline"
          className="w-full bg-background shadow-sm hover:bg-gray-50"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {new Date(form.getValues("date")).toLocaleDateString()}
        </Button>

        {showCalendar && (
          <Card className="p-4">
            <DatePicker 
              form={form} 
              department={initialDepartment}
              onSelect={() => setShowCalendar(false)}
            />
          </Card>
        )}

        {/* Department Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b pb-4">
          <h2 className="text-lg font-medium">
            {decodeURIComponent(initialDepartment)}
          </h2>
        </div>

        {/* Previous Patients */}
        <NumberInput
          form={form}
          name="previous_patients"
          label="Old patients"
          className="bg-background"
        />

        {/* Transfer Sections */}
        <TransfersInSection form={form} />
        <TransfersOutSection form={form} />

        {/* OT Cases */}
        <NumberInput
          form={form}
          name="ot_cases"
          label="OT Cases"
          className="bg-background"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gray-900 hover:bg-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}