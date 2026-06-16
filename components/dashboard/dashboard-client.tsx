"use client"

import { useState, useOptimistic } from "react"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { RecentAppointments } from "@/components/dashboard/recent-appointments"
import { PatientForm } from "@/components/dashboard/patient-form"
import { PatientIntakeForm } from "@/components/dashboard/patient-intake-form"
import { PatientSearch } from "@/components/dashboard/patient-search"
import type { Patient } from "@/types/patient"

interface DashboardClientProps {
  /** Patients fetched on the server (from the DB) and streamed into the client. */
  patients: Patient[]
}

export function DashboardClient({ patients }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // React 19 useOptimistic over the server-provided patient list. On submit the
  // form prepends a pending patient so its row shows instantly; once the action
  // settles and the route revalidates, the real list replaces the optimistic one.
  const [optimisticPatients, addOptimisticPatient] = useOptimistic(
    patients,
    (current: Patient[], pending: Patient) =>
      current.some((p) => p.id === pending.id)
        ? current
        : [pending, ...current]
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">
            Overview of your patients and appointments
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <PatientSearch onSearchChange={setSearchQuery} />
          <PatientIntakeForm />
          <PatientForm addOptimisticPatient={addOptimisticPatient} />
        </div>
      </div>

      {/* Stats Overview - Hidden when searching */}
      {!searchQuery && <StatsOverview />}

      {/* Recent Appointments */}
      <RecentAppointments
        searchQuery={searchQuery}
        patients={optimisticPatients}
      />
    </div>
  )
}
