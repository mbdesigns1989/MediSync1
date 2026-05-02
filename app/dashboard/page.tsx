"use client"

import { useState } from "react"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { RecentAppointments } from "@/components/dashboard/recent-appointments"
import { PatientForm } from "@/components/dashboard/patient-form"
import { PatientSearch } from "@/components/dashboard/patient-search"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

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
          <PatientForm />
        </div>
      </div>

      {/* Stats Overview - Hidden when searching */}
      {!searchQuery && <StatsOverview />}

      {/* Recent Appointments */}
      <RecentAppointments searchQuery={searchQuery} />
    </div>
  )
}
