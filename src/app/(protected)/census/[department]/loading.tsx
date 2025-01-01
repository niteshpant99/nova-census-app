// src/app/(protected)/census/[department]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function CensusEntryLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32 bg-gray-700" />
          <Skeleton className="h-6 w-24 bg-gray-700" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="container max-w-md mx-auto p-4 space-y-6">
        {/* Date Picker Skeleton */}
        <Skeleton className="h-10 w-full" />

        {/* Department Name Skeleton */}
        <Skeleton className="h-8 w-48" />

        {/* Form Fields Skeleton */}
        <Card className="p-6 space-y-6">
          {/* Old Patients */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Transfers In Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            {[1, 2, 3].map((i) => (
              <div key={`in-${i}`} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          {/* Transfers Out Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={`out-${i}`} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          {/* OT Cases */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Submit Button */}
          <Skeleton className="h-10 w-full" />
        </Card>
      </main>
    </div>
  );
}