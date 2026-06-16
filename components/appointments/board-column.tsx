"use client"

import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { cn } from "@/lib/utils"
import type { Appointment, AppointmentStatus } from "@/types/appointment"
import { AppointmentCard } from "./appointment-card"

interface BoardColumnProps {
  status: AppointmentStatus
  appointments: Appointment[]
}

const columnAccent: Record<AppointmentStatus, string> = {
  Waiting: "text-yellow-700",
  "In Progress": "text-blue-700",
  Completed: "text-green-700",
  Scheduled: "text-slate-700",
}

export function BoardColumn({ status, appointments }: BoardColumnProps) {
  // The column id is the status string — drop target resolution keys off it.
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-lg border border-slate-200 bg-slate-50/60 p-3 transition-colors",
        isOver && "border-blue-400 bg-blue-50/60"
      )}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className={cn("text-sm font-semibold", columnAccent[status])}>
          {status}
        </h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
          {appointments.length}
        </span>
      </div>

      <SortableContext
        items={appointments.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex min-h-24 flex-col gap-2">
          {appointments.length === 0 ? (
            <p className="px-1 py-6 text-center text-xs text-slate-400">
              Drop appointments here
            </p>
          ) : (
            appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}
