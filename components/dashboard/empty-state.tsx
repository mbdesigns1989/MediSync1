"use client"

import { Stethoscope } from "lucide-react"
import { Button } from "@/components/ui"

interface EmptyStateProps {
  onAddPatientClick?: () => void
}

export function EmptyState({ onAddPatientClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-lg bg-blue-50 p-4 mb-4">
        <Stethoscope className="h-12 w-12 text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mt-4">
        No patients in queue
      </h3>
      <p className="text-sm text-slate-500 mt-2 text-center max-w-sm">
        You haven't added any patients yet. Click the button below to get started.
      </p>
      {onAddPatientClick && (
        <Button onClick={onAddPatientClick} className="mt-4">
          Add your first patient
        </Button>
      )}
    </div>
  )
}
