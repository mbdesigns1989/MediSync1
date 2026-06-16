"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Appointment } from "@/types/appointment"

interface AppointmentCardProps {
  appointment: Appointment
  /** Rendered inside DragOverlay (the floating clone) — skips sortable wiring. */
  overlay?: boolean
}

export function AppointmentCard({ appointment, overlay }: AppointmentCardProps) {
  const sortable = useSortable({ id: appointment.id })
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable

  const style = overlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
      }

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={cn(
        "flex items-start gap-2 rounded-md border border-slate-200 bg-white p-3 shadow-sm",
        overlay && "shadow-lg ring-2 ring-blue-300",
        !overlay && isDragging && "opacity-40"
      )}
    >
      <button
        type="button"
        className="mt-0.5 cursor-grab touch-none text-slate-400 hover:text-slate-600 active:cursor-grabbing"
        aria-label={`Drag ${appointment.patientName}'s appointment`}
        {...(overlay ? {} : attributes)}
        {...(overlay ? {} : listeners)}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">
          {appointment.patientName}
        </p>
        <p className="truncate text-xs text-slate-500">{appointment.reason}</p>
      </div>
    </div>
  )
}
