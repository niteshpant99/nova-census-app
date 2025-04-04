// src/app/(protected)/census/[department]/page.tsx
import { CensusEntryPageClient } from '@/components/census/CensusEntryPageClient'
import { notFound } from 'next/navigation'
import { isValidDepartment } from '@/lib/config/departments'

interface PageParams {
  department: string
}

export default async function CensusEntryPage({
  params,
}: {
  params: PageParams
}) {
  const department = params.department

  // Validate the department parameter
  if (!isValidDepartment(department)) {
    notFound()
  }

  return (
    <CensusEntryPageClient 
      department={department} 
    />
  )
}

// Optionally add metadata
export async function generateMetadata({
  params,
}: {
  params: PageParams
}) {
  return {
    title: `Census Entry - ${params.department}`,
    description: `Enter census data for ${params.department}`,
  }
}