'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DEPARTMENTS } from "@/components/dashboard/config/departments";

export default function CensusPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-medium">Nova Census App</h1>
        <div className="text-sm">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Select Department</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {DEPARTMENTS.map((dept) => (
            <Link 
              key={dept.id} 
              href={`/census/${encodeURIComponent(dept.id)}`}
            >
              <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium">{dept.name}</h3>
                <p className="text-sm text-gray-500">
                  Total beds: {dept.totalBeds}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}