// src/components/census/CensusEntryPageClient.tsx
'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { CensusEntryForm } from '@/components/census/CensusEntryForm';
import { FormErrorBoundary } from '@/components/error-boundary/FormErrorBoundary';
import { Suspense } from 'react';

export function CensusEntryPageClient({
  department,
}: {
  department: string
}) {
  // Decode the department parameter here instead of in the page
  const decodedDepartment = decodeURIComponent(department);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="container max-w-md mx-auto p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <FormErrorBoundary>
            <CensusEntryForm initialDepartment={decodedDepartment} />
          </FormErrorBoundary>
        </Suspense>
      </main>
    </div>
  );
}