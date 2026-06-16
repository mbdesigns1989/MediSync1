"use client"

import { useState, useOptimistic } from "react"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { RecentAppointments } from "@/components/dashboard/recent-appointments"
import { PatientForm } from "@/components/dashboard/patient-form"
import { PatientSearch } from "@/components/dashboard/patient-search"
import { usePatientStore } from "@/store"
import type { Patient } from "@/types/patient"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const patients = usePatientStore((state) => state.patients)

  // React 19 useOptimistic, owned at the page level so it spans the two siblings
  // that need it: the form (which triggers the optimistic add inside its action)
  // and the table (which renders the result). The committed store patients are the
  // base; on submit the form prepends a pending patient so its row shows instantly.
  // When the action settles and addPatient() commits the real row, React
  // automatically drops the optimistic value.
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
          <PatientForm addOptimisticPatient={addOptimisticPatient} />
        </div>
      </div>

      {/* Stats Overview - Hidden when searching */}
      {!searchQuery && <StatsOverview />}

      {/* Recent Appointments */}
      <RecentAppointments
        searchQuery={searchQuery}
        optimisticPatients={optimisticPatients}
      />
    </div>
  )
}
