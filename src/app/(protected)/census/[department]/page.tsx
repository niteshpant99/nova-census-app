// src/app/(protected)/census/[department]/page.tsx
import { CensusEntryPageClient } from '@/components/census/CensusEntryPageClient'
import { notFound } from 'next/navigation'
import { isValidDepartment } from '@/components/dashboard/config/departments'

type PageParams = Promise<{
  department: string
}>

export default async function CensusEntryPage({
  params,
}: {
  params: PageParams
}) {
  const resolvedParams = await params
  const department = resolvedParams.department

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
  const resolvedParams = await params
  return {
    title: `Census Entry - ${resolvedParams.department}`,
    description: `Enter census data for ${resolvedParams.department}`,
  }
}