// src/app/(protected)/dashboard/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-8 w-48" />
        </div>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-4 py-4">
        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Historical Overview */}
          <Card className="col-span-2 p-6">
            <Skeleton className="h-[300px]" />
          </Card>

          {/* Department Occupancy */}
          <Card className="p-6">
            <Skeleton className="h-[300px]" />
          </Card>

          {/* Discharge Analysis */}
          <Card className="p-6">
            <Skeleton className="h-[300px]" />
          </Card>

          {/* Trends Analysis */}
          <Card className="col-span-2 p-6">
            <Skeleton className="h-[300px]" />
          </Card>
        </div>
      </main>
    </div>
  );
}