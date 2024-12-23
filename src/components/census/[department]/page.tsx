// src/app/census/[department]/page.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { NumberInput } from "@/components/census/NumberInput";
import { ReviewScreen } from "@/components/census/ReviewScreen";
import { censusEntrySchema, type CensusFormData } from "@/lib/schemas/census";
import { useToast } from "@/hooks/use-toast";
import { TRPCClientErrorLike } from '@trpc/client';
import { cn } from '@/lib/utils';
import { api } from "@/lib/api";
import type { AppRouter } from "@/server/api/root";
interface PageProps {
params: {
department: string;
};
}
export default function CensusEntryPage({ params }: PageProps) {
const [showCalendar, setShowCalendar] = useState(false);
const [isReviewing, setIsReviewing] = useState(false);
const { toast } = useToast();
const form = useForm<CensusFormData>({
resolver: zodResolver(censusEntrySchema),
defaultValues: {
date: new Date(),
department: decodeURIComponent(params.department),
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
ot_cases: 0
}
});
const submitMutation = api.census.submit.useMutation({
onSuccess: (response) => {
toast({
title: "Success",
description: response.message,
});
form.reset();
setIsReviewing(false);
},
onError: (error: TRPCClientErrorLike<AppRouter>) => {
toast({
title: "Error",
description: error.message,
variant: "destructive",
});
setIsReviewing(false);
},
});
const generateMessageMutation = api.census.generateMessage.useMutation();
const handleSubmit = async (data: CensusFormData) => {
try {
const messageResponse = await generateMessageMutation.mutateAsync(data);
await navigator.clipboard.writeText(messageResponse.message);
toast({
title: "WhatsApp Message Copied",
description: "The formatted message has been copied to your clipboard",
});
submitMutation.mutate(data);
} catch (error) {
toast({
title: "Error",
description: "Failed to generate message",
variant: "destructive",
});
}
};
const onSubmit = (data: CensusFormData) => {
if (!isReviewing) {
setIsReviewing(true);
return;
}
handleSubmit(data);
};
if (isReviewing) {
return (
<ReviewScreen
data={form.getValues()}
onSubmit={() => handleSubmit(form.getValues())}
onEdit={() => setIsReviewing(false)}
isLoading={submitMutation.isPending || generateMessageMutation.isPending}
/>
);
}

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-medium">Nova Census App</h1>
        <div className="text-sm">
          <span className="mr-2">Nitesh Pant</span>
          <span className="bg-blue-500 px-2 py-1 rounded text-xs">NP</span>
        </div>
      </div>

      <div className="container max-w-md mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Picker */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-background shadow-sm hover:bg-gray-50"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {form.getValues("date").toLocaleDateString()}
            </Button>

            {showCalendar && (
              <Card className="p-4">
                <Calendar
                  mode="single"
                  selected={form.getValues("date")}
                  onSelect={(date) => {
                    if (date) {
                      form.setValue("date", date);
                      setShowCalendar(false);
                    }
                  }}
                  className="rounded-md border"
                />
              </Card>
            )}

            {/* Department Name */}
            <div>
              <h2 className="text-lg font-medium mb-4">
                {decodeURIComponent(params.department)}
              </h2>
            </div>

            {/* Old Patients */}
            <NumberInput
              form={form}
              name="previous_patients"
              label="Old patients"
              className="bg-background"
            />

            {/* Transfer In Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Transfer in</h3>
              <NumberInput
                form={form}
                name="referrals_in"
                label="Referred in"
                className="bg-background"
              />
              <NumberInput
                form={form}
                name="department_transfers_in"
                label="Department Transfers"
                className="bg-background"
              />
              <NumberInput
                form={form}
                name="admissions"
                label="Admissions"
                className="bg-background"
              />
            </div>

            {/* Transfer Out Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Transfer out</h3>
              <NumberInput
                form={form}
                name="recovered"
                label="Recovered"
                className="bg-background"
              />
              <NumberInput
                form={form}
                name="lama"
                label="LAMA"
                className="bg-background"
              />
              <NumberInput
                form={form}
                name="absconded"
                label="Absconded"
                className="bg-background"
              />
              <NumberInput
                form={form}
                name="referred_out"
                label="Referred out"
                className="bg-background"
              />
              <NumberInput
                form={form}
                name="not_improved"
                label="Not improved"
                className="bg-background"
              />
              <NumberInput
                form={form}
                name="deaths"
                label="Death"
                className="bg-background"
              />
            </div>

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
              disabled={submitMutation.isPending || generateMessageMutation.isPending}
            >
              {(submitMutation.isPending || generateMessageMutation.isPending) 
                ? "Submitting..." 
                : "Continue"
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}